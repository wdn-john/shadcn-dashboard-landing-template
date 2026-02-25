"use client"

import { create } from "zustand"
import { ChatSocketType } from "@/types/ChatSocketType"
import { MissionSocketType } from "@/types/MissionSocketType"

export type SocketEventType = ChatSocketType | MissionSocketType | "presence:update"

export type WebSocketMessage<T = unknown> = {
  type: SocketEventType
  payload: T
}

interface ChatSocketStore {
  connected: boolean
  connecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  subscribeTopic: (topic: string) => void
  sendMessage: <T>(message: WebSocketMessage<T>) => void
  registerHandler: (type: string, handler: (payload: unknown) => void) => void
  unregisterHandler: (type: string) => void
}

// Module-level singletons (survive re-renders, live outside React lifecycle)
let socket: WebSocket | null = null
let reconnectAttempts = 0
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let heartbeatTimer: ReturnType<typeof setInterval> | null = null
let pendingMessages: string[] = []
const eventHandlers: Record<string, (payload: unknown) => void> = {}
const pendingSubscriptions: Set<string> = new Set()

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "wss://api.workedin.ca/ws/chat"

async function fetchWsToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/ws-token")
    if (!res.ok) return null
    const json = await res.json()
    return json.token ?? null
  } catch {
    return null
  }
}

export const useChatSocketStore = create<ChatSocketStore>((set, get) => ({
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

    const url = `${WS_URL}?token=${encodeURIComponent(token)}`
    socket = new WebSocket(url)

    socket.onopen = () => {
      set({ connected: true, connecting: false })
      reconnectAttempts = 0

      // Replay subscriptions
      pendingSubscriptions.forEach((topic) => {
        get().sendMessage({ type: "subscribe", payload: { topic } })
      })

      // Flush queued messages
      pendingMessages.forEach((msg) => socket?.send(msg))
      pendingMessages = []

      // Start heartbeat
      heartbeatTimer = setInterval(() => {
        get().sendMessage({ type: "chat-heartbeat", payload: {} })
      }, 10_000)
    }

    socket.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data as string)
        const handler = eventHandlers[data.type]
        if (handler) handler(data.payload)
      } catch {
        // ignore parse errors
      }
    }

    socket.onclose = () => {
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

    socket.onerror = () => {
      socket?.close()
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

  sendMessage: <T>(message: WebSocketMessage<T>) => {
    const serialized = JSON.stringify(message)
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(serialized)
    } else {
      if (pendingMessages.length < 1000) {
        pendingMessages.push(serialized)
      }
    }
  },

  registerHandler: (type, handler) => {
    eventHandlers[type] = handler
  },

  unregisterHandler: (type) => {
    delete eventHandlers[type]
  },
}))
