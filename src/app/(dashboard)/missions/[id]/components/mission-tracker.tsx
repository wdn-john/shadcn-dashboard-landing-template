"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMissionSyncStore } from "@/store/missionSyncStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import type { MissionProgressDTO } from "@/types/MissionProgress"
import type { MissionStep } from "@/types/MissionStep"
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  SkipForward,
  Loader2,
  SendHorizonal,
  Wand2,
  Play,
  Trash2,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ReviewForm } from "@/components/review-form"

type Props = {
  missionId: number
  missionEntityId: number
  initialProgress: MissionProgressDTO | null
  allStepsCompleted: boolean
  clientName?: string
}

const STATUS_CONFIG = {
  COMPLETED: {
    label: "Completed",
    variant: "default" as const,
    icon: CheckCircle2,
  },
  IN_PROGRESS: {
    label: "In Progress",
    variant: "secondary" as const,
    icon: Clock,
  },
  PENDING: { label: "Pending", variant: "outline" as const, icon: Clock },
  BLOCKED: {
    label: "Blocked",
    variant: "destructive" as const,
    icon: AlertTriangle,
  },
  SKIPPED: { label: "Skipped", variant: "outline" as const, icon: SkipForward },
}

export function MissionTracker({
  missionId,
  missionEntityId,
  initialProgress,
  allStepsCompleted,
  clientName,
}: Props) {
  const router = useRouter()
  const [progress, setProgress] = useState<MissionProgressDTO | null>(
    initialProgress
  )
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())

  // Real-time sync from WebSocket
  const syncedDetails = useMissionSyncStore((s) => s.syncedDetails)
  const syncedProgress = useMissionSyncStore((s) => s.syncedProgress)
  useEffect(() => {
    if (syncedDetails?.progressId === missionId && syncedProgress) {
      setProgress(syncedProgress)
    }
  }, [syncedDetails, syncedProgress, missionId])
  const [notes, setNotes] = useState<Record<number, string>>({})
  const [updatingStep, setUpdatingStep] = useState<number | null>(null)
  const [requestingApproval, setRequestingApproval] = useState(false)
  const [generatingSteps, setGeneratingSteps] = useState(false)
  const [generatedSteps, setGeneratedSteps] = useState<MissionStep[] | null>(
    null
  )
  const [startingMission, setStartingMission] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isWaitingApproval = progress?.missionStatus === "WAITING_APPROVAL"
  const isCompleted = progress?.missionStatus === "COMPLETED"
  const canRequestApproval =
    !isWaitingApproval &&
    !isCompleted &&
    progress !== null &&
    progress.completionPercentage === 100

  // ── No progress yet: show "Start Mission" flow ──
  if (!progress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Play className="size-4" /> Start Mission
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!generatedSteps ? (
            <>
              <p className="text-sm text-muted-foreground">
                Generate a structured step plan using AI, review it, then start
                the mission.
              </p>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                onClick={handleGenerateSteps}
                disabled={generatingSteps}
                className="gap-2 self-start"
              >
                {generatingSteps ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="size-4" /> Generate Steps
                  </>
                )}
              </Button>
            </>
          ) : (
            <GeneratedStepsPreview
              steps={generatedSteps}
              setSteps={setGeneratedSteps}
              onStart={handleStartMission}
              starting={startingMission}
              error={error}
            />
          )}
        </CardContent>
      </Card>
    )
  }

  // ── Progress exists: show tracker ──
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-base">Mission Progress</CardTitle>
            <div className="flex items-center gap-2">
              {isWaitingApproval && (
                <Badge variant="secondary" className="text-xs">
                  Awaiting Client Approval
                </Badge>
              )}
              {isCompleted && (
                <Badge variant="default" className="text-xs">
                  Completed
                </Badge>
              )}
              <span className="text-sm font-semibold">
                {progress.completionPercentage}%
              </span>
            </div>
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

          {progress.steps.map((step, idx) => (
            <StepCard
              key={step.id}
              step={step}
              index={idx}
              expanded={expandedSteps.has(step.id)}
              note={notes[step.id] ?? step.note?.text ?? ""}
              updating={updatingStep === step.id}
              isWaitingApproval={isWaitingApproval}
              isCompleted={isCompleted}
              onToggleExpand={() => {
                setExpandedSteps((prev) => {
                  const next = new Set(prev)
                  next.has(step.id) ? next.delete(step.id) : next.add(step.id)
                  return next
                })
              }}
              onNoteChange={(val) =>
                setNotes((p) => ({ ...p, [step.id]: val }))
              }
              onUpdateStatus={(status) =>
                handleUpdateStep(
                  step,
                  status,
                  notes[step.id] ?? step.note?.text ?? ""
                )
              }
            />
          ))}

          {canRequestApproval && (
            <>
              <Separator className="my-2" />
              <Button
                onClick={handleRequestApproval}
                disabled={requestingApproval}
                className="gap-2"
              >
                {requestingApproval ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Requesting...
                  </>
                ) : (
                  <>
                    <SendHorizonal className="size-4" /> Request Client Approval
                  </>
                )}
              </Button>
            </>
          )}

          {isWaitingApproval && (
            <p className="text-sm text-muted-foreground text-center pt-2">
              All steps completed. Waiting for client to review and approve.
            </p>
          )}
          {isCompleted && (
            <p className="text-sm text-green-600 font-medium text-center pt-2">
              Mission approved. Payment has been released.
            </p>
          )}
        </CardContent>
      </Card>

      {isCompleted && clientName && (
        <ReviewForm missionId={missionEntityId} revieweeName={clientName} />
      )}
    </>
  )

  async function handleGenerateSteps() {
    setGeneratingSteps(true)
    setError(null)
    const res = await fetch(`/api/missions/${missionId}/generate-steps`)
    const data = await res.json().catch(() => ({}))
    setGeneratingSteps(false)
    if (!res.ok || !data.ok) {
      setError(data.message ?? "Failed to generate steps")
      return
    }
    setGeneratedSteps(data.data?.steps ?? [])
  }

  async function handleStartMission(steps: MissionStep[]) {
    setStartingMission(true)
    setError(null)
    const res = await fetch(`/api/missions/${initialProgress?.id}/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steps }),
    })
    const data = await res.json().catch(() => ({}))
    setStartingMission(false)
    if (!res.ok || !data.ok) {
      setError(data.message ?? "Failed to start mission")
      return
    }
    setProgress(data.data)
    setGeneratedSteps(null)
    router.refresh()
  }

  async function handleUpdateStep(
    step: MissionStep,
    newStatus: MissionStep["status"],
    noteText: string
  ) {
    setUpdatingStep(step.id)
    setError(null)

    const stepPayload = {
      id: step.id,
      isCompleted: newStatus === "COMPLETED",
      status: newStatus,
      note: noteText.trim()
        ? {
            index: 0,
            text: noteText.trim(),
            createdAt: new Date().toISOString(),
          }
        : null,
      attachments: [],
    }

    const formData = new FormData()
    formData.append("step", JSON.stringify(stepPayload))

    const res = await fetch(`/api/missions/${initialProgress?.id}/progress`, {
      method: "PATCH",
      body: formData,
    })
    const data = await res.json().catch(() => ({}))
    setUpdatingStep(null)

    if (!res.ok || !data.ok) {
      setError(data.message ?? "Failed to update step")
      return
    }
    setProgress(data.data)
  }

  async function handleRequestApproval() {
    setRequestingApproval(true)
    setError(null)
    const res = await fetch(
      `/api/missions/${initialProgress?.id}/approval-request`,
      {
        method: "PATCH",
      }
    )
    const data = await res.json().catch(() => ({}))
    setRequestingApproval(false)
    if (!res.ok || !data.ok) {
      setError(data.message ?? "Failed to request approval")
      return
    }
    setProgress(data.data)
  }
}

// ── Step card ──
function StepCard({
  step,
  index,
  expanded,
  note,
  updating,
  isWaitingApproval,
  isCompleted,
  onToggleExpand,
  onNoteChange,
  onUpdateStatus,
}: {
  step: MissionStep
  index: number
  expanded: boolean
  note: string
  updating: boolean
  isWaitingApproval: boolean
  isCompleted: boolean
  onToggleExpand: () => void
  onNoteChange: (v: string) => void
  onUpdateStatus: (s: MissionStep["status"]) => void
}) {
  const cfg = STATUS_CONFIG[step.status]
  const Icon = cfg.icon
  const locked = isWaitingApproval || isCompleted

  return (
    <div
      className={cn(
        "rounded-lg border transition-colors",
        step.status === "COMPLETED" &&
          "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20",
        step.status === "IN_PROGRESS" && "border-primary/30 bg-primary/5",
        step.status === "BLOCKED" && "border-destructive/30 bg-destructive/5"
      )}
    >
      {/* Header row */}
      <button
        type="button"
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
        onClick={onToggleExpand}
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
          {index + 1}
        </span>
        <span className="flex-1 font-medium text-sm">
          {step.title?.en ?? step.title?.fr ?? `Step ${index + 1}`}
        </span>
        <Badge variant={cfg.variant} className="text-xs shrink-0 gap-1">
          <Icon className="size-3" />
          {cfg.label}
        </Badge>
        {expanded ? (
          <ChevronDown className="size-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="size-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t pt-3">
          {step.summary?.en && (
            <p className="text-sm text-muted-foreground">{step.summary.en}</p>
          )}
          {step.instructions?.en && (
            <p className="text-xs text-muted-foreground italic">
              {step.instructions.en}
            </p>
          )}

          {/* Note */}
          {!locked && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Note{" "}
                {step.status === "COMPLETED" || step.status === "IN_PROGRESS"
                  ? "(required to complete)"
                  : "(optional)"}
              </label>
              <Textarea
                rows={3}
                placeholder="Add a note about this step..."
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
              />
              {note.length > 0 && note.length < 15 && (
                <p className="text-xs text-muted-foreground">
                  {15 - note.length} more characters needed
                </p>
              )}
            </div>
          )}

          {step.note?.text && locked && (
            <div className="rounded-md bg-muted px-3 py-2 text-sm">
              <p className="text-xs text-muted-foreground mb-1">Note</p>
              <p>{step.note.text}</p>
            </div>
          )}

          {/* Action buttons */}
          {!locked && (
            <div className="flex flex-wrap gap-2">
              {step.status !== "IN_PROGRESS" && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={updating}
                  onClick={() => onUpdateStatus("IN_PROGRESS")}
                >
                  {updating ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Clock className="size-3 mr-1" />
                  )}
                  Start
                </Button>
              )}
              {(step.status === "IN_PROGRESS" || step.status === "PENDING") && (
                <Button
                  size="sm"
                  disabled={updating || note.trim().length < 15}
                  onClick={() => onUpdateStatus("COMPLETED")}
                >
                  {updating ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-3 mr-1" />
                  )}
                  Mark Complete
                </Button>
              )}
              {step.status === "COMPLETED" && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={updating}
                  onClick={() => onUpdateStatus("IN_PROGRESS")}
                >
                  Reopen
                </Button>
              )}
              {step.status !== "BLOCKED" && step.status !== "COMPLETED" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  disabled={updating}
                  onClick={() => onUpdateStatus("BLOCKED")}
                >
                  <AlertTriangle className="size-3 mr-1" /> Block
                </Button>
              )}
              {step.status !== "SKIPPED" && step.status !== "COMPLETED" && (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={updating}
                  onClick={() => onUpdateStatus("SKIPPED")}
                >
                  <SkipForward className="size-3 mr-1" /> Skip
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Generated steps preview (before starting) ──
function GeneratedStepsPreview({
  steps,
  setSteps,
  onStart,
  starting,
  error,
}: {
  steps: MissionStep[]
  setSteps: (s: MissionStep[]) => void
  onStart: (s: MissionStep[]) => void
  starting: boolean
  error: string | null
}) {
  function removeStep(id: number) {
    setSteps(steps.filter((s) => s.id !== id))
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Review the generated steps below. Remove any that don&apos;t apply, then
        start the mission.
      </p>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {steps.map((step, idx) => (
        <div
          key={step.id}
          className="flex items-start gap-3 rounded-lg border px-3 py-2.5"
        >
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold mt-0.5">
            {idx + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">
              {step.title?.en ?? `Step ${idx + 1}`}
            </p>
            {step.summary?.en && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {step.summary.en}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeStep(step.id)}
            className="text-muted-foreground hover:text-destructive transition-colors mt-0.5"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <Button
          onClick={() => onStart(steps)}
          disabled={starting || steps.length === 0}
          className="gap-2"
        >
          {starting ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Starting...
            </>
          ) : (
            <>
              <Play className="size-4" /> Start Mission
            </>
          )}
        </Button>
        <Button variant="ghost" size="sm" disabled>
          <Plus className="size-3 mr-1" /> Add Step
        </Button>
      </div>
    </div>
  )
}
