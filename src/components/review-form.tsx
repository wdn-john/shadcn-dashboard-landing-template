"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Star, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

type Props = {
  missionId: number
  revieweeName: string
}

export function ReviewForm({ missionId, revieweeName }: Props) {
  const { t } = useTranslation()
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const TAGS = [
    { key: "professional", label: t("review.tags.professional") },
    { key: "onTime", label: t("review.tags.onTime") },
    { key: "communication", label: t("review.tags.communication") },
    { key: "knowledge", label: t("review.tags.knowledge") },
  ]

  if (submitted) {
    return (
      <>
        <Separator />
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <CheckCircle2 className="size-8 text-green-500" />
          <p className="font-semibold text-sm">{t("review.successTitle")}</p>
          <p className="text-sm text-muted-foreground">{t("review.successMessage")}</p>
        </div>
      </>
    )
  }

  function toggleTag(label: string) {
    setSelectedTags((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    )
  }

  async function handleSubmit() {
    if (rating === 0) { setError(t("review.ratingRequired")); return }
    if (!comment.trim()) { setError(t("review.commentRequired")); return }
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
      setError(data.message ?? t("review.failed"))
      return
    }
    setSubmitted(true)
  }

  return (
    <>
      <Separator />
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("review.title")}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("review.subtitle", { name: revieweeName })}
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
                key={tag.key}
                type="button"
                onClick={() => toggleTag(tag.label)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  selectedTags.includes(tag.label)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Comment */}
          <Textarea
            rows={3}
            placeholder={t("review.commentPlaceholder")}
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
              ? <><Loader2 className="size-4 animate-spin" /> {t("review.submitting")}</>
              : t("review.submit")}
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
