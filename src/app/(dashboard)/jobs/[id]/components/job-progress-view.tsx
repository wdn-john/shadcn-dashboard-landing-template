"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useJobSyncStore } from "@/store/jobSyncStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  SkipForward,
  ChevronDown,
  ChevronRight,
  Loader2,
  ThumbsUp,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ReviewForm } from "@/components/review-form"

type Step = {
  id: number
  title: { en: string; fr: string }
  summary: { en: string; fr: string }
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "BLOCKED" | "SKIPPED"
  note: { text: string } | null
  orderIndex: number
}

type ProgressData = {
  id: number
  status: string
  isCompleted: boolean
  completionPercentage: number
  currentStep: number
  steps: Step[]
} | null

type Props = {
  jobId: number
  initialProgress: ProgressData
  isWaitingApproval: boolean
  isCompleted: boolean
  expertName?: string
}

export function JobProgressView({
  jobId,
  initialProgress,
  isWaitingApproval,
  isCompleted,
  expertName,
}: Props) {
  const { t } = useTranslation()
  const STATUS_CONFIG = {
    COMPLETED: { label: t("missions.status.COMPLETED"), variant: "default" as const, icon: CheckCircle2 },
    IN_PROGRESS: { label: t("missions.status.IN_PROGRESS"), variant: "secondary" as const, icon: Clock },
    PENDING: { label: t("missions.status.PENDING"), variant: "outline" as const, icon: Clock },
    BLOCKED: { label: t("missions.status.BLOCKED"), variant: "destructive" as const, icon: AlertTriangle },
    SKIPPED: { label: t("missions.status.SKIPPED"), variant: "outline" as const, icon: SkipForward },
  }
  const router = useRouter()
  const [progress, setProgress] = useState(initialProgress)
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())

  // Real-time sync from WebSocket
  const syncedJobDetails = useJobSyncStore((s) => s.syncedJobDetails)
  const syncedJobProgress = useJobSyncStore((s) => s.syncedJobProgress)
  useEffect(() => {
    if (syncedJobDetails?.id === jobId && syncedJobProgress) {
      setProgress(syncedJobProgress as unknown as ProgressData)
    }
  }, [syncedJobDetails, syncedJobProgress, jobId])
  const [approving, setApproving] = useState(false)
  const [revisionOpen, setRevisionOpen] = useState(false)
  const [revisionMessage, setRevisionMessage] = useState("")
  const [submittingRevision, setSubmittingRevision] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!progress) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          {t("jobs.noProgress")}
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-base">{t("jobs.workProgress")}</CardTitle>
            <span className="text-sm font-semibold">
              {progress.completionPercentage}%
            </span>
          </div>
          <Progress
            value={progress.completionPercentage}
            className="h-2 mt-2"
          />
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2 mb-2">
              {error}
            </p>
          )}

          {progress.steps
            .slice()
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((step, idx) => {
              const cfg = STATUS_CONFIG[step.status]
              const Icon = cfg.icon
              const isExpanded = expandedSteps.has(step.id)
              return (
                <div
                  key={step.id}
                  className={cn(
                    "rounded-lg border transition-colors",
                    step.status === "COMPLETED" &&
                      "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20",
                    step.status === "IN_PROGRESS" &&
                      "border-primary/30 bg-primary/5",
                    step.status === "BLOCKED" &&
                      "border-destructive/30 bg-destructive/5"
                  )}
                >
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-3 text-left"
                    onClick={() =>
                      setExpandedSteps((prev) => {
                        const next = new Set(prev)
                        next.has(step.id)
                          ? next.delete(step.id)
                          : next.add(step.id)
                        return next
                      })
                    }
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                      {idx + 1}
                    </span>
                    <span className="flex-1 font-medium text-sm">
                      {step.title?.en ?? `Step ${idx + 1}`}
                    </span>
                    <Badge
                      variant={cfg.variant}
                      className="text-xs shrink-0 gap-1"
                    >
                      <Icon className="size-3" />
                      {cfg.label}
                    </Badge>
                    {isExpanded ? (
                      <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t pt-3 flex flex-col gap-2">
                      {step.summary?.en && (
                        <p className="text-sm text-muted-foreground">
                          {step.summary.en}
                        </p>
                      )}
                      {step.note?.text && (
                        <div className="rounded-md bg-muted px-3 py-2 text-sm">
                          <p className="text-xs text-muted-foreground mb-1">
                            {t("jobs.expertNote")}
                          </p>
                          <p>{step.note.text}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

          {(isWaitingApproval || isCompleted) && <Separator className="my-2" />}

          {isWaitingApproval && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleApprove}
                disabled={approving}
                className="gap-2 flex-1"
              >
                {approving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> {t("jobs.approving")}
                  </>
                ) : (
                  <>
                    <ThumbsUp className="size-4" /> {t("jobs.approveRelease")}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setRevisionOpen(true)}
                disabled={approving}
                className="gap-2"
              >
                <RefreshCw className="size-4" /> {t("jobs.requestRevision")}
              </Button>
            </div>
          )}

          {isCompleted && (
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium pt-1">
              <CheckCircle2 className="size-4" />
              {t("jobs.missionCompleted")}
            </div>
          )}
        </CardContent>
      </Card>

      {isCompleted && expertName && (
        <ReviewForm missionId={jobId} revieweeName={expertName} />
      )}

      {/* Revision dialog */}
      <Dialog
        open={revisionOpen}
        onOpenChange={(o) => {
          setRevisionOpen(o)
          if (!o) setRevisionMessage("")
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("jobs.requestRevision")}</DialogTitle>
            <DialogDescription>
              {t("jobs.revisionDescription")}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            rows={4}
            placeholder={t("jobs.revisionPlaceholder")}
            value={revisionMessage}
            onChange={(e) => setRevisionMessage(e.target.value)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevisionOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleRevision}
              disabled={submittingRevision || !revisionMessage.trim()}
              className="gap-2"
            >
              {submittingRevision ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> {t("jobs.sending")}
                </>
              ) : (
                <>
                  <RefreshCw className="size-4" /> {t("jobs.sendRevision")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )

  async function handleApprove() {
    setApproving(true)
    setError(null)
    const res = await fetch(`/api/jobs/${initialProgress?.id}/approve`)
    const data = await res.json().catch(() => ({}))
    setApproving(false)
    if (!res.ok || !data.ok) {
      setError(data.message ?? t("jobs.approveFailed"))
      return
    }
    setProgress(data.data)
    router.refresh()
  }

  async function handleRevision() {
    setSubmittingRevision(true)
    setError(null)
    const formData = new FormData()
    formData.append("message", revisionMessage.trim())
    const res = await fetch(`/api/jobs/${initialProgress?.id}/revision`, {
      method: "POST",
      body: formData,
    })
    const data = await res.json().catch(() => ({}))
    setSubmittingRevision(false)
    if (!res.ok || !data.ok) {
      setError(data.message ?? t("jobs.revisionFailed"))
      return
    }
    setRevisionOpen(false)
    setRevisionMessage("")
    setProgress(data.data)
    router.refresh()
  }
}
