"use client"

import { create } from "zustand"
import { fetchWsToken } from "@/lib/ws-token"
import type { MainSocketType } from "@/types/MainSocketType"

type MainWebSocketMessage<T = unknown> = {
  type: MainSocketType
  payload: T
}

interface MainSocketStore {
  connected: boolean
  connecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  subscribeTopic: (topic: string) => void
  sendMessage: <T>(message: MainWebSocketMessage<T>) => void
  registerHandler: (type: string, handler: (payload: unknown) => void) => void
  unregisterHandler: (type: string) => void
}

let socket: WebSocket | null = null
let reconnectAttempts = 0
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let heartbeatTimer: ReturnType<typeof setInterval> | null = null
let pendingMessages: string[] = []
const eventHandlers: Record<string, (payload: unknown) => void> = {}
const pendingSubscriptions: Set<string> = new Set()

const MAIN_WS_URL =
  process.env.NEXT_PUBLIC_MAIN_WS_URL ?? "ws://localhost:8080/ws"

export const useMainSocketStore = create<MainSocketStore>((set, get) => ({
  connected: false,
  connecting: false,

  connect: async () => {
    if (
      socket &&
      (socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING)
    )
      return

    set({ connecting: true })

    const token = await fetchWsToken()
    if (!token) {
      set({ connecting: false })
      return
    }

    const ws = new WebSocket(
      `${MAIN_WS_URL}?token=${encodeURIComponent(token)}`
    )
    socket = ws

    ws.onopen = () => {
      if (socket !== ws) return

      set({ connected: true, connecting: false })
      reconnectAttempts = 0

      pendingSubscriptions.forEach((topic) => {
        ws.send(JSON.stringify({ type: "subscribe", payload: { topic } }))
      })

      const toFlush = pendingMessages.splice(0)
      toFlush.forEach((msg) => ws.send(msg))

      heartbeatTimer = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "heartbeat", payload: {} }))
        }
      }, 10_000)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string) as { type: string; payload: unknown }
        const handler = eventHandlers[data.type]
        if (handler) handler(data.payload)
      } catch {
        // ignore parse errors
      }
    }

    ws.onclose = () => {
      if (socket !== ws) return
      set({ connected: false, connecting: true })
      if (heartbeatTimer) clearInterval(heartbeatTimer)

      reconnectAttempts++
      if (reconnectAttempts > 10) {
        set({ connecting: false })
        return
      }
      const delay =
        Math.min(1000 * 2 ** reconnectAttempts, 30_000) + Math.random() * 1000
      reconnectTimer = setTimeout(() => void get().connect(), delay)
    }

    ws.onerror = () => {
      ws.close()
    }
  },

  disconnect: () => {
    if (reconnectTimer) clearTimeout(reconnectTimer)
    if (heartbeatTimer) clearInterval(heartbeatTimer)
    reconnectAttempts = 0
    pendingMessages = []
    if (socket) {
      socket.close()
      socket = null
    }
    set({ connected: false, connecting: false })
  },

  subscribeTopic: (topic: string) => {
    pendingSubscriptions.add(topic)
    if (socket?.readyState === WebSocket.OPEN) {
      get().sendMessage({ type: "subscribe", payload: { topic } })
    }
  },

  sendMessage: <T>(message: MainWebSocketMessage<T>) => {
    const serialized = JSON.stringify(message)
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(serialized)
    } else if (pendingMessages.length < 1000) {
      pendingMessages.push(serialized)
    }
  },

  registerHandler: (type, handler) => {
    eventHandlers[type] = handler
  },

  unregisterHandler: (type) => {
    delete eventHandlers[type]
  },
}))
