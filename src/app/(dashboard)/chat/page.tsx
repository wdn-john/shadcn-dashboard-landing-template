"use client"

import { useEffect, useMemo, useRef } from "react"
import { Chat } from "./components/chat"
import { type Conversation, type Message, type User } from "./use-chat"
import { useChatStore } from "@/store/chatStore"
import { type ChatListItem } from "@/types/ChatListItem"
import { type Message as BackendMessage } from "@/types/Chat"

function mapRoom(item: ChatListItem): Conversation {
  return {
    id: String(item.id),
    type: "direct",
    participants: [item.recipientId ?? ""],
    name: item.name,
    avatar: item.avatar ?? "",
    lastMessage: {
      id: String(item.id),
      content: item.lastMessage ?? "",
      timestamp: item.time,
      senderId: item.recipientId ?? "",
    },
    unreadCount: item.unreadCount ?? 0,
    isPinned: false,
    isMuted: false,
  }
}

function mapMessage(msg: BackendMessage): Message {
  return {
    id: String(msg.id ?? `local-${Math.random()}`),
    content: msg.content ?? "",
    timestamp: msg.sentAt ?? new Date().toISOString(),
    senderId: String(msg.sender ?? ""),
    type: "text",
    isEdited: false,
    reactions: [],
    replyTo: null,
  }
}

export default function ChatPage() {
  const rooms = useChatStore((s) => s.rooms)
  const storeMessages = useChatStore((s) => s.messages)
  const fetchRooms = useChatStore((s) => s.fetchRooms)
  const fetchMessages = useChatStore((s) => s.fetchMessages)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const roomsLoading = useChatStore((s) => s.roomsLoading)
  const hasFetchedFirst = useRef(false)

  useEffect(() => {
    void fetchRooms()
  }, [fetchRooms])

  // Auto-fetch messages for the first room (Chat auto-selects it)
  useEffect(() => {
    if (!hasFetchedFirst.current && rooms.length > 0) {
      hasFetchedFirst.current = true
      void fetchMessages(rooms[0].id)
    }
  }, [rooms, fetchMessages])

  const conversations: Conversation[] = useMemo(() => rooms.map(mapRoom), [rooms])

  const messages: Record<string, Message[]> = useMemo(() => {
    const mapped: Record<string, Message[]> = {}
    Object.entries(storeMessages).forEach(([roomId, msgs]) => {
      mapped[roomId] = msgs.map(mapMessage)
    })
    return mapped
  }, [storeMessages])

  const users: User[] = useMemo(
    () =>
      rooms
        .filter((r) => r.recipientId)
        .map((r) => ({
          id: r.recipientId!,
          name: r.name,
          avatar: r.avatar ?? "",
          status: "online" as const,
          email: "",
          lastSeen: r.time,
          role: "",
          department: "",
        })),
    [rooms]
  )

  const handleSelectConversation = (conversationId: string) => {
    const roomId = Number(conversationId)
    if (!isNaN(roomId)) void fetchMessages(roomId)
  }

  const handleSendMessage = (conversationId: string, content: string) => {
    const roomId = Number(conversationId)
    if (!isNaN(roomId)) void sendMessage(roomId, content)
  }

  if (roomsLoading && rooms.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading chat...</div>
      </div>
    )
  }

  return (
    <div className="px-4 md:px-6">
      <Chat
        conversations={conversations}
        messages={messages}
        users={users}
        onSelectConversation={handleSelectConversation}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}
