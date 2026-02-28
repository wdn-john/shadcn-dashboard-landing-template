"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Clock, Tag, Wrench, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type Priority = "Low" | "Medium" | "High"

export interface ServiceRequestData {
  id: number
  title: string
  submittedBy: string
  description: string
  ageText?: string
  priority?: Priority
  tags?: string[]
  category?: string
  avatarUrl?: string
}

interface Props {
  open: boolean
  request: ServiceRequestData | null
  onClose: () => void
  autoDismissSeconds?: number
}

const PRIORITY_COLOR: Record<Priority, string> = {
  Low: "bg-emerald-500",
  Medium: "bg-amber-500",
  High: "bg-red-500",
}

const PRIORITY_BADGE: Record<Priority, string> = {
  Low: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-800",
  Medium:
    "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-800",
  High: "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/40 dark:border-red-800",
}

const RADIUS = 45
const STROKE = 6
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function NewServiceRequestModal({
  open,
  request,
  onClose,
  autoDismissSeconds = 30,
}: Props) {
  const router = useRouter()
  const [secondsLeft, setSecondsLeft] = useState(autoDismissSeconds)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Reset & start countdown whenever modal opens
  useEffect(() => {
    if (!open) return
    setSecondsLeft(autoDismissSeconds)

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          timerRef.current = null
          return 0
        }
        return prev - 1
      })
    }, 1_000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [open, autoDismissSeconds])

  // Auto-dismiss when countdown hits 0
  useEffect(() => {
    if (open && secondsLeft === 0) {
      const id = setTimeout(() => onClose(), 0)
      return () => clearTimeout(id)
    }
  }, [secondsLeft, open, onClose])

  const progress = (autoDismissSeconds - secondsLeft) / autoDismissSeconds
  const dashOffset = CIRCUMFERENCE * progress
  const priority = request?.priority ?? "Medium"

  function handleViewDetails() {
    console.log("Request", request?.id)
    onClose()
    if (request?.id) router.push(`/browse-requests/${request.id}`)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose()
      }}
    >
      <DialogContent
        className="p-0 gap-0 max-w-sm overflow-hidden"
        showCloseButton={false}
      >
        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-foreground text-background shrink-0">
                <Wrench className="size-4" />
              </div>
              <div>
                <DialogTitle className="font-semibold text-base leading-tight">
                  New Service Request
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  {request?.category ?? "IT Support"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Circular countdown timer */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative size-16">
              <svg
                width="64"
                height="64"
                viewBox="0 0 100 100"
                className="-rotate-90"
              >
                {/* Track */}
                <circle
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={STROKE}
                  className="text-muted"
                />
                {/* Progress */}
                <circle
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                  strokeDashoffset={dashOffset}
                  className="text-foreground transition-[stroke-dashoffset] duration-1000 linear"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                {secondsLeft}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Auto-dismiss in{" "}
              <span className="font-semibold">{secondsLeft}</span>s
            </p>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="px-6 py-4 space-y-3">
          {/* Request card bubble */}
          <div className="rounded-lg bg-muted/50 p-4 flex gap-3">
            <div
              className={cn(
                "mt-1.5 size-2 rounded-full shrink-0",
                PRIORITY_COLOR[priority]
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm leading-snug mb-1.5">
                {request?.title}
              </p>
              <div className="flex items-center gap-2 mb-1.5">
                <Avatar className="size-5">
                  <AvatarImage src={request?.avatarUrl} />
                  <AvatarFallback className="text-[10px]">
                    {request?.submittedBy?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  Submitted by {request?.submittedBy}
                </span>
              </div>
              <p className="text-xs text-foreground/70 leading-relaxed line-clamp-2">
                {request?.description}
              </p>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              <span>{request?.ageText ?? "just now"}</span>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-[11px] font-semibold",
                PRIORITY_BADGE[priority]
              )}
            >
              {priority} Priority
            </Badge>
          </div>

          {/* Tags */}
          {request?.tags && request.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Tag className="size-3.5 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground">
                {request.tags.join(" · ")}
              </span>
            </div>
          )}
        </div>

        {/* ── Actions ── */}
        <div className="px-6 pb-6 flex flex-col gap-2">
          <Button className="w-full gap-2" onClick={handleViewDetails}>
            View Details
          </Button>
          <Button variant="secondary" className="w-full" onClick={onClose}>
            Ignore
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
