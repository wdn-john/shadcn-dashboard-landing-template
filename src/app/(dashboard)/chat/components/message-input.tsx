"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  Send,
  Paperclip,
  Smile,
  Image as ImageIcon,
  FileText,
  Mic,
  MoreHorizontal
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { useTranslation } from "react-i18next"

interface MessageInputProps {
  onSendMessage: (content: string) => void
  onTypingChange?: (isTyping: boolean) => void
  disabled?: boolean
  placeholder?: string
}

// How long after the last keystroke before we broadcast "stopped typing"
const TYPING_STOP_DELAY = 2000

export function MessageInput({
  onSendMessage,
  onTypingChange,
  disabled = false,
  placeholder,
}: MessageInputProps) {
  const { t } = useTranslation()
  const resolvedPlaceholder = placeholder ?? t("chat.typeMessage")
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typingActiveRef = useRef(false)

  const stopTyping = useCallback(() => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current)
      typingTimerRef.current = null
    }
    if (!typingActiveRef.current) return
    typingActiveRef.current = false
    onTypingChange?.(false)
  }, [onTypingChange])

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    }
  }, [])

  const handleSendMessage = () => {
    const trimmedMessage = message.trim()
    if (trimmedMessage && !disabled) {
      stopTyping()
      onSendMessage(trimmedMessage)
      setMessage("")

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setMessage(value)

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }

    if (value.trim()) {
      // Broadcast typing:start only once per typing burst
      if (!typingActiveRef.current) {
        typingActiveRef.current = true
        onTypingChange?.(true)
      }
      // Reset inactivity timer — fires stopTyping after silence
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
      typingTimerRef.current = setTimeout(stopTyping, TYPING_STOP_DELAY)
    } else {
      stopTyping()
    }
  }

  const handleFileUpload = (type: "image" | "file") => {
    console.log(`Upload ${type}`)
  }

  return (
    <div className="border-t p-4">
      <div className="flex items-end gap-2">
        {/* Attachment button */}
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    className="cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("chat.attachFile")}</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="top" align="start">
              <DropdownMenuItem
                onClick={() => handleFileUpload("image")}
                className="cursor-pointer"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                {t("chat.photoOrVideo")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFileUpload("file")}
                className="cursor-pointer"
              >
                <FileText className="h-4 w-4 mr-2" />
                {t("chat.document")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>

        {/* Message input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            placeholder={resolvedPlaceholder}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyPress}
            disabled={disabled}
            className={cn(
              "min-h-[40px] max-h-[120px] resize-none cursor-text disabled:cursor-not-allowed",
              "pr-20"
            )}
            rows={1}
          />

          {/* Input action buttons */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={disabled}
                    className="h-6 w-6 p-0 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("chat.addEmoji")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={disabled}
                    className="h-6 w-6 p-0 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>More options</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Voice message or send button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {message.trim() ? (
                <Button
                  onClick={handleSendMessage}
                  disabled={disabled}
                  className="cursor-pointer disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={disabled}
                  className="cursor-pointer disabled:cursor-not-allowed"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{message.trim() ? t("chat.sendMessage") : t("chat.voiceMessage")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
