"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageSquare, Loader2 } from "lucide-react"

type Props = {
  recipientId: string
  recipientName?: string
  /** Optional variant override */
  variant?: "default" | "outline" | "secondary" | "ghost"
  className?: string
}

export function StartChatButton({
  recipientId,
  recipientName,
  variant = "outline",
  className,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)

    const res = await fetch(`/api/chat/rooms/private/${recipientId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })

    const data = await res.json().catch(() => ({ ok: false }))
    setLoading(false)

    if (!data.ok || !data.data?.id) {
      setError("Could not start conversation. Please try again.")
      return
    }

    // Navigate to chat page with the room pre-selected
    router.push(`/chat?room=${data.data.id}`)
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant={variant}
        size="sm"
        className={`gap-2 ${className ?? ""}`}
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <MessageSquare className="size-3.5" />
        )}
        {recipientName ? `Message ${recipientName.split(" ")[0]}` : "Send Message"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
