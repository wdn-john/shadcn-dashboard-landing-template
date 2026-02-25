"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Star, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const TAGS = ["Professional", "On time", "Great communication", "Expert knowledge"]

type Props = {
  missionId: number
  revieweeName: string
}

export function ReviewForm({ missionId, revieweeName }: Props) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (submitted) {
    return (
      <>
        <Separator />
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <CheckCircle2 className="size-8 text-green-500" />
          <p className="font-semibold text-sm">Review Submitted</p>
          <p className="text-sm text-muted-foreground">Thank you for your feedback!</p>
        </div>
      </>
    )
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  async function handleSubmit() {
    if (rating === 0) { setError("Please select a rating."); return }
    if (!comment.trim()) { setError("Please write a comment."); return }
    setSubmitting(true)
    setError(null)
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating,
        comment: comment.trim(),
        tags: selectedTags.map((tagName) => ({ tagName })),
        missionId,
      }),
    })
    const data = await res.json().catch(() => ({}))
    setSubmitting(false)
    if (!res.ok || !data.ok) {
      setError(data.message ?? "Failed to submit review. Please try again.")
      return
    }
    setSubmitted(true)
  }

  return (
    <>
      <Separator />
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Leave a Review</CardTitle>
          <p className="text-sm text-muted-foreground">
            Share your experience working with {revieweeName}.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Star rating */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "size-7 transition-colors",
                    (hovered || rating) >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/30"
                  )}
                />
              </button>
            ))}
          </div>

          {/* Tag pills */}
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  selectedTags.includes(tag)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Comment */}
          <Textarea
            rows={3}
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="gap-2 self-start"
          >
            {submitting
              ? <><Loader2 className="size-4 animate-spin" /> Submitting...</>
              : "Submit Review"}
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
