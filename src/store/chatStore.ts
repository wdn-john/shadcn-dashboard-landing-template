"use client"

import { create } from "zustand"
import { ChatListItem } from "@/types/ChatListItem"
import { Message } from "@/types/Chat"

interface ChatStore {
  // State
  rooms: ChatListItem[]
  messages: Record<number, Message[]>
  /** Per-room list of user IDs currently typing (matches shared store shape) */
  typing: Record<number, string[]>
  activeRoomId: number | null
  roomsLoading: boolean
  messagesLoading: Record<number, boolean>

  // Actions
  setActiveRoom: (roomId: number | null) => void
  fetchRooms: () => Promise<void>
  fetchMessages: (roomId: number) => Promise<void>
  sendMessage: (chatroomId: number, content: string) => Promise<void>
  markRead: (messageId: string) => Promise<void>

  // WS event handler
  handleEvent: (type: string, payload: unknown) => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  rooms: [],
  messages: {},
  typing: {},
  activeRoomId: null,
  roomsLoading: false,
  messagesLoading: {},

  setActiveRoom: (roomId) => set({ activeRoomId: roomId }),

  fetchRooms: async () => {
    set({ roomsLoading: true })
    try {
      const res = await fetch("/api/chat/rooms")
      const json = await res.json()
      if (json.ok) {
        set({ rooms: json.data as ChatListItem[] })
      }
    } finally {
      set({ roomsLoading: false })
    }
  },

  fetchMessages: async (roomId) => {
    set((s) => ({ messagesLoading: { ...s.messagesLoading, [roomId]: true } }))
    try {
      const res = await fetch(`/api/chat/rooms/${roomId}/messages`)
      const json = await res.json()
      if (json.ok) {
        set((s) => ({
          messages: { ...s.messages, [roomId]: json.data as Message[] },
        }))
      }
    } finally {
      set((s) => ({
        messagesLoading: { ...s.messagesLoading, [roomId]: false },
      }))
    }
  },

  sendMessage: async (chatroomId, content) => {
    const res = await fetch("/api/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatroomId, content }),
    })
    const json = await res.json()
    if (json.ok && json.data) {
      const msg = json.data as Message
      set((s) => ({
        messages: {
          ...s.messages,
          [chatroomId]: [...(s.messages[chatroomId] ?? []), msg],
        },
      }))
    }
  },

  markRead: async (messageId) => {
    await fetch(`/api/chat/messages/${messageId}/read`, { method: "PATCH" })
  },

  handleEvent: (type, payload) => {
    console.log("Chat handler called with type:", type, "and payload:", payload)
    switch (type) {
      case "new:chat:message": {
        const msg = payload as Message
        if (!msg.chatroomId) return
        set((s) => {
          const existing = s.messages[msg.chatroomId] ?? []
          // Deduplicate by id — only when id is defined; undefined ids are never treated as duplicates
          if (msg.id && existing.some((m) => m.id === msg.id)) return s
          // Update room's lastMessage preview
          const rooms = s.rooms.map((r) =>
            r.id === msg.chatroomId
              ? {
                  ...r,
                  lastMessage: msg.content ?? r.lastMessage,
                  time: msg.sentAt ?? r.time,
                  unreadCount:
                    s.activeRoomId === msg.chatroomId
                      ? 0
                      : (r.unreadCount ?? 0) + 1,
                }
              : r
          )
          return {
            rooms,
            messages: {
              ...s.messages,
              [msg.chatroomId]: [...existing, msg],
            },
          }
        })
        // Auto mark-read if this room is currently active
        if (get().activeRoomId === msg.chatroomId && msg.id) {
          void get().markRead(String(msg.id))
        }
        break
      }

      case "typing:update": {
        // Server sends { roomId, userId (or typingUserId), isTyping }
        const p = payload as {
          roomId?: number
          userId?: string
          typingUserId?: string
          isTyping: boolean
        }
        const roomId = p.roomId
        const typingUserId = p.userId ?? p.typingUserId
        if (!roomId || !typingUserId) break
        set((s) => {
          const current = s.typing[roomId] ?? []
          const updated = p.isTyping
            ? Array.from(new Set([...current, typingUserId]))
            : current.filter((id) => id !== typingUserId)
          return { typing: { ...s.typing, [roomId]: updated } }
        })
        break
      }

      case "presence:update":
        // Could track online status per userId if needed
        break

      default:
        break
    }
  },
}))
