"use client"

import { useEffect, useMemo, useState } from "react"
import { Menu, X } from "lucide-react"

import { TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { ConversationList } from "./conversation-list"
import { ChatHeader } from "./chat-header"
import { MessageList } from "./message-list"
import { MessageInput } from "./message-input"
import { useChat, type Conversation, type Message, type User } from "../use-chat"
import { useChatSocketStore } from "@/store/chatSocketStore"
import { useChatStore } from "@/store/chatStore"
import { useTranslation } from "react-i18next"

interface ChatProps {
  conversations: Conversation[]
  messages: Record<string, Message[]>
  users: User[]
  currentUserId?: string
  onSelectConversation?: (conversationId: string) => void
  onSendMessage?: (conversationId: string, content: string) => void
  defaultConversationId?: string
}

export function Chat({
  conversations,
  messages,
  users,
  currentUserId,
  onSelectConversation,
  onSendMessage,
  defaultConversationId,
}: ChatProps) {
  const {
    selectedConversation,
    setSelectedConversation,
    setConversations,
    setMessages,
    setUsers,
    addMessage,
    toggleMute,
  } = useChat()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { t } = useTranslation()
  const sendWsMessage = useChatSocketStore((s) => s.sendMessage)
  const typing = useChatStore((s) => s.typing)
  const isRecipientTyping = selectedConversation
    ? (typing[Number(selectedConversation)] ?? []).some((id) => id !== currentUserId)
    : false

  const currentConversation = conversations.find((conv) => conv.id === selectedConversation)
  const currentMessages = selectedConversation ? messages[selectedConversation] ?? [] : []

  const handleTypingChange = (isTyping: boolean) => {
    if (!selectedConversation) return
    const roomId = Number(selectedConversation)
    const recipientId = currentConversation?.participants[0]

    if (isTyping) {
      // Match mobile sendTyping: type "typing:update" + destination (recipientId)
      sendWsMessage({
        type: "typing:update",
        payload: { topic: "typing:update", roomId, destination: recipientId, isTyping: true },
      })
    } else {
      // Match mobile stopTyping: type "typing" + roomId only
      sendWsMessage({
        type: "typing",
        payload: { topic: "typing", roomId, isTyping: false },
      })
    }
  }

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined" ? window.innerWidth : 0 >= 1024) { // lg breakpoint
        setIsSidebarOpen(false)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener('resize', handleResize)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  // Initialize data
  useEffect(() => {
    setConversations(conversations)
    setUsers(users)

    // Set messages for all conversations
    Object.entries(messages).forEach(([conversationId, conversationMessages]) => {
      setMessages(conversationId, conversationMessages)
    })

    // Auto-select: prefer defaultConversationId, then first conversation
    if (!selectedConversation) {
      const target = defaultConversationId
        ? conversations.find((c) => c.id === defaultConversationId)
        : conversations[0]
      if (target) setSelectedConversation(target.id)
    }
  }, [conversations, messages, users, selectedConversation, defaultConversationId, setConversations, setMessages, setUsers, setSelectedConversation])

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return

    // Optimistic update
    const newMessage = {
      id: `msg-${Date.now()}`,
      content,
      timestamp: new Date().toISOString(),
      senderId: "current-user",
      type: "text" as const,
      isEdited: false,
      reactions: [],
      replyTo: null,
    }
    addMessage(selectedConversation, newMessage)

    // Real API call
    onSendMessage?.(selectedConversation, content)
  }

  const handleToggleMute = () => {
    if (selectedConversation) {
      toggleMute(selectedConversation)
    }
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="h-full min-h-[600px] max-h-[calc(100vh-200px)] flex rounded-lg border overflow-hidden bg-background">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Conversations Sidebar - Responsive */}
        <div className={`
          w-100 border-r bg-background flex-shrink-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:relative lg:block
          fixed inset-y-0 left-0 z-50
          transition-transform duration-300 ease-in-out
        `}>
          {/* Sidebar Header with Close Button (Mobile Only) */}
          <div className="lg:hidden p-4 border-b flex items-center justify-between bg-background">
            <h2 className="text-lg font-semibold">{t("chat.messages")}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(false)}
              className="cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={(id) => {
              setSelectedConversation(id)
              setIsSidebarOpen(false)
              onSelectConversation?.(id)
            }}
          />
        </div>

        {/* Chat Panel - Flexible Width */}
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          {/* Chat Header with Hamburger Menu */}
          <div className="flex items-center h-16 px-4 border-b bg-background">
            {/* Hamburger Menu Button - Only visible when sidebar is hidden on mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
              className="cursor-pointer lg:hidden mr-2"
            >
              <Menu className="h-4 w-4" />
            </Button>

            <div className="flex-1">
              <ChatHeader
                conversation={currentConversation || null}
                users={users}
                onToggleMute={handleToggleMute}
              />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 flex flex-col min-h-0">
            {selectedConversation ? (
              <>
                <MessageList
                  messages={currentMessages}
                  users={users}
                  currentUserId={currentUserId}
                  isRecipientTyping={isRecipientTyping}
                  recipientAvatar={currentConversation?.avatar}
                  recipientName={currentConversation?.name}
                />

                {/* Message Input */}
                <MessageInput
                  onSendMessage={handleSendMessage}
                  onTypingChange={handleTypingChange}
                  placeholder={t("chat.messagePlaceholder", { name: currentConversation?.name || "" })}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">{t("chat.welcome")}</h3>
                  <p className="text-muted-foreground">
                    {t("chat.selectConversation")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
