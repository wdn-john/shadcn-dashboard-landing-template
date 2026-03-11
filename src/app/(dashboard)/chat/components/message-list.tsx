"use client"

import { useEffect, useRef } from "react"
import { format, isToday, isYesterday } from "date-fns"
import { CheckCheck, MoreHorizontal, Reply, Copy, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { type Message, type User } from "../use-chat"
import { useTranslation } from "react-i18next"

interface MessageListProps {
  messages: Message[]
  users: User[]
  currentUserId?: string
  isRecipientTyping?: boolean
  recipientAvatar?: string
  recipientName?: string
}

export function MessageList({
  messages,
  users,
  currentUserId = "current-user",
  isRecipientTyping = false,
  recipientAvatar,
  recipientName,
}: MessageListProps) {
  const { t } = useTranslation()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const previousMessageCountRef = useRef(0)
  const isInitialLoadRef = useRef(true)
  const previousConversationRef = useRef<string | null>(null)

  // Reset scroll behavior when switching conversations
  useEffect(() => {
    const currentConversationId = messages.length > 0 ? messages[0]?.id?.split('-')[0] : null
    if (currentConversationId !== previousConversationRef.current) {
      isInitialLoadRef.current = true
      previousConversationRef.current = currentConversationId
    }
  }, [messages])

  // Scroll to bottom: instant on initial load / room switch, smooth on new messages
  useEffect(() => {
    if (!bottomRef.current) return

    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false
      previousMessageCountRef.current = messages.length
      bottomRef.current.scrollIntoView()
      return
    }

    if (messages.length > previousMessageCountRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }

    previousMessageCountRef.current = messages.length
  }, [messages])

  // Scroll to bottom when the typing indicator appears
  useEffect(() => {
    if (isRecipientTyping) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [isRecipientTyping])

  const getUserById = (userId: string) => {
    if (userId === currentUserId) {
      return {
        id: currentUserId,
        name: "You",
        avatar: "https://notion-avatars.netlify.app/api/avatar/?preset=male-7",
        status: "online" as const,
        email: "you@example.com",
        lastSeen: new Date().toISOString(),
        role: "Developer",
        department: "Engineering"
      }
    }
    return users.find(user => user.id === userId)
  }

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    if (isToday(date)) {
      return format(date, "HH:mm")
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, "HH:mm")}`
    } else {
      return format(date, "MMM d, HH:mm")
    }
  }

  const shouldShowAvatar = (message: Message, index: number) => {
    if (message.senderId === currentUserId) return false
    if (index === 0) return true

    const prevMessage = messages[index - 1]
    return prevMessage.senderId !== message.senderId
  }

  const shouldShowName = (message: Message, index: number) => {
    if (message.senderId === currentUserId) return false
    if (index === 0) return true

    const prevMessage = messages[index - 1]
    return prevMessage.senderId !== message.senderId
  }

  const isConsecutiveMessage = (message: Message, index: number) => {
    if (index === 0) return false

    const prevMessage = messages[index - 1]
    const timeDiff = new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime()

    return prevMessage.senderId === message.senderId && timeDiff < 5 * 60 * 1000 // 5 minutes
  }

  const groupMessagesByDay = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = []

    messages.forEach((message) => {
      const messageDate = format(new Date(message.timestamp), "yyyy-MM-dd")
      const lastGroup = groups[groups.length - 1]

      if (lastGroup && lastGroup.date === messageDate) {
        lastGroup.messages.push(message)
      } else {
        groups.push({
          date: messageDate,
          messages: [message]
        })
      }
    })

    return groups
  }

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString)
    if (isToday(date)) {
      return t("chat.today")
    } else if (isYesterday(date)) {
      return t("chat.yesterday")
    } else {
      return format(date, "EEEE, MMMM d")
    }
  }

  const messageGroups = groupMessagesByDay(messages)

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-4" ref={scrollAreaRef}>
      <div className="space-y-4 py-4">
        {messageGroups.map((group) => (
          <div key={group.date}>
            {/* Date separator */}
            <div className="flex items-center justify-center py-2">
              <div className="text-xs text-muted-foreground bg-background px-3 py-1 rounded-full border">
                {formatDateHeader(group.date)}
              </div>
            </div>

            {/* Messages for this day */}
            <div className="space-y-1">
              {group.messages.map((message, messageIndex) => {
                const user = getUserById(message.senderId)
                const isOwnMessage = message.senderId === currentUserId
                const showAvatar = shouldShowAvatar(message, messageIndex)
                const showName = shouldShowName(message, messageIndex)
                const isConsecutive = isConsecutiveMessage(message, messageIndex)

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 group",
                      isOwnMessage && "flex-row-reverse",
                      isConsecutive && !isOwnMessage && "ml-12"
                    )}
                  >
                    {/* Avatar */}
                    {!isOwnMessage && (
                      <div className="w-8">
                        {showAvatar && user && (
                          <Avatar className="h-8 w-8 cursor-pointer">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-xs">
                              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    )}

                    {/* Message content */}
                    <div className={cn("flex-1 max-w-[70%]", isOwnMessage && "flex flex-col items-end")}>
                      {/* Sender name for group messages */}
                      {showName && user && !isOwnMessage && (
                        <div className="text-sm font-medium text-foreground mb-1">
                          {user.name}
                        </div>
                      )}

                      {/* Message bubble */}
                      <div className="relative group/message">
                        <div
                          className={cn(
                            "rounded-lg px-3 py-2 text-sm break-words",
                            isOwnMessage
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted",
                            isConsecutive && "mt-1"
                          )}
                        >
                          <p>{message.content}</p>

                          {/* Message reactions */}
                          {message.reactions.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {message.reactions.map((reaction, idx) => (
                                <div
                                  key={idx}
                                  className={cn(
                                    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border cursor-pointer",
                                    "bg-background/90 backdrop-blur-sm shadow-sm"
                                  )}
                                >
                                  <span>{reaction.emoji}</span>
                                  <span className="text-muted-foreground">{reaction.count}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Timestamp and status */}
                          <div className={cn(
                            "flex items-center gap-1 mt-1 text-xs",
                            isOwnMessage
                              ? "text-primary-foreground/70 justify-end"
                              : "text-muted-foreground"
                          )}>
                            <span>{formatMessageTime(message.timestamp)}</span>
                            {message.isEdited && (
                              <span className="italic">{t("chat.edited")}</span>
                            )}
                            {isOwnMessage && (
                              <div className="flex">
                                {/* Message status indicators */}
                                <CheckCheck className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Message actions */}
                        <div className="absolute top-0 right-0 opacity-0 group-hover/message:opacity-100">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 cursor-pointer"
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="cursor-pointer">
                                <Reply className="h-4 w-4 mr-2" />
                                {t("chat.reply")}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Copy className="h-4 w-4 mr-2" />
                                {t("chat.copy")}
                              </DropdownMenuItem>
                              {isOwnMessage && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="cursor-pointer text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t("chat.delete")}
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Typing indicator — rendered as an incoming bubble like mobile */}
        {isRecipientTyping && (
          <div className="flex gap-3 items-end">
            <div className="w-8 shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={recipientAvatar} alt={recipientName} />
                <AvatarFallback className="text-xs">
                  {recipientName?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="bg-muted rounded-lg px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
