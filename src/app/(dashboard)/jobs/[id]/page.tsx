import { notFound } from "next/navigation"
import { serverGet } from "@/lib/server/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import {
  ArrowLeft,
  DollarSign,
  CalendarDays,
  MapPin,
  Monitor,
  Building2,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Clock,
  MessageSquare,
  CreditCard,
  RotateCcw,
  ThumbsUp,
} from "lucide-react"
import { JobProgressView } from "./components/job-progress-view"
import { MissionDocuments } from "@/components/mission-documents"

type JobDetails = {
  id: number
  progressId: number
  title: string
  description: string
  status: string
  payoutStatus: "PENDING" | "COMPLETED" | "FAILED" | "ON_HOLD" | "REFUNDED"
  workLocation: "ON_SITE" | "REMOTE" | "NOT_SURE"
  priority: "LOW" | "MEDIUM" | "HIGH"
  finalQuotedPrice: number
  desiredCompletionDate: string | null
  revisionCount: number
  expertName: string
  expertId: string
  expertAvatarUrl: string | null
  expertProfession: string
  expertTitle?: string
  expertBusinessName?: string
  attachments: { id: number; label: string; attachmentUrl: string; createdAt: string }[]
  address: {
    streetNumber?: string
    street?: string
    city?: string
    region?: string
    postalCode?: string
  } | null
}

type JobProgressDTO = {
  id: number
  expertName: string
  expertProfession: string
  expertAvatarUrl: string
  status: string
  isCompleted: boolean
  completionPercentage: number
  currentStep: number
  steps: Array<{
    id: number
    title: { en: string; fr: string }
    summary: { en: string; fr: string }
    status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "BLOCKED" | "SKIPPED"
    note: { text: string } | null
    orderIndex: number
  }>
}

function priorityVariant(p: string) {
  switch (p) {
    case "HIGH": return "destructive" as const
    case "MEDIUM": return "secondary" as const
    default: return "outline" as const
  }
}

function jobStatusConfig(status: string) {
  switch (status) {
    case "IN_PROGRESS": return { label: "In Progress", variant: "secondary" as const }
    case "COMPLETED": return { label: "Completed", variant: "default" as const }
    case "WAITING_APPROVAL":
    case "WAITING_PHASE_APPROVAL": return { label: "Awaiting Your Approval", variant: "outline" as const }
    default: return { label: status.replace(/_/g, " "), variant: "outline" as const }
  }
}

function payoutStatusConfig(status: string) {
  switch (status) {
    case "COMPLETED": return { label: "Released", className: "text-green-600 dark:text-green-400", icon: CheckCircle2 }
    case "FAILED": return { label: "Failed", className: "text-destructive", icon: AlertCircle }
    case "ON_HOLD": return { label: "On Hold", className: "text-amber-600 dark:text-amber-400", icon: Clock }
    default: return { label: "Pre-authorized", className: "text-muted-foreground", icon: Clock }
  }
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const details = await serverGet<JobDetails>(`/jobs/${id}/details`)
  if (!details) notFound()

  const progressData = await serverGet<JobProgressDTO>(
    `/jobs/${details.progressId}/progress`
  ).catch(() => null)

  const expertInitials =
    details.expertName
      ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?"

  const isWaitingApproval =
    details.status === "WAITING_APPROVAL" || details.status === "WAITING_PHASE_APPROVAL"
  const isCompleted = details.status === "COMPLETED"

  const daysLeft = details.desiredCompletionDate
    ? Math.ceil((new Date(details.desiredCompletionDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  const fullAddress = details.address
    ? [
        details.address.streetNumber && details.address.street
          ? `${details.address.streetNumber} ${details.address.street}`
          : details.address.street,
        details.address.city,
        details.address.region,
        details.address.postalCode,
      ].filter(Boolean).join(", ")
    : null

  const statusCfg = jobStatusConfig(details.status)
  const payoutCfg = payoutStatusConfig(details.payoutStatus)
  const PayoutIcon = payoutCfg.icon

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-5xl">

      {/* Back + Header */}
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link href="/jobs" className="flex items-center gap-1 text-muted-foreground">
            <ArrowLeft className="size-3" /> Work in Progress
          </Link>
        </Button>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h1 className="text-2xl font-bold tracking-tight">{details.title}</h1>
          <div className="flex gap-2 flex-wrap">
            <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
            <Badge variant={priorityVariant(details.priority)}>{details.priority}</Badge>
            {details.workLocation && (
              <Badge variant="outline">{details.workLocation.replace("_", " ")}</Badge>
            )}
          </div>
        </div>
        {daysLeft !== null && (
          <p className={`text-sm mt-1 flex items-center gap-1.5 ${
            daysLeft < 0 ? "text-destructive" : daysLeft <= 3 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
          }`}>
            <CalendarDays className="size-3.5" />
            {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : daysLeft === 0 ? "Due today" : `${daysLeft} days remaining`}
          </p>
        )}
      </div>

      {/* Status banners */}
      {isWaitingApproval && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-4 flex gap-3">
          <ThumbsUp className="size-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">Your Approval is Needed</p>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
              The expert has completed all steps and is awaiting your approval. Review the work and approve to release payment, or request a revision.
            </p>
          </div>
        </div>
      )}
      {isCompleted && (
        <div className="rounded-xl border border-green-200 bg-green-50/70 dark:border-green-800 dark:bg-green-950/30 px-4 py-4 flex gap-3">
          <CheckCircle2 className="size-5 shrink-0 text-green-600 dark:text-green-400 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800 dark:text-green-300">Mission Completed</p>
            <p className="text-sm text-green-700 dark:text-green-400 mt-0.5">
              You approved the work and payment has been released to the expert.
            </p>
          </div>
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

        {/* ── Left: main content ── */}
        <div className="flex flex-col gap-6 min-w-0">

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mission Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{details.description}</p>
            </CardContent>
          </Card>

          {/* Project details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm">
              {/* Work location */}
              <div className="flex items-start gap-3">
                {details.workLocation === "REMOTE" ? (
                  <Monitor className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                ) : (
                  <MapPin className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                )}
                <div>
                  <p className="font-medium">
                    {details.workLocation === "REMOTE" ? "Remote" : details.workLocation === "ON_SITE" ? "On-site" : "Flexible"}
                  </p>
                  {details.workLocation === "ON_SITE" && fullAddress && (
                    <p className="text-xs text-muted-foreground mt-0.5">{fullAddress}</p>
                  )}
                  {details.workLocation === "REMOTE" && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Work will be performed remotely.
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Due Date</span>
                  {details.desiredCompletionDate ? (
                    <span className="font-medium flex items-center gap-1">
                      <CalendarDays className="size-3.5 text-muted-foreground" />
                      {new Date(details.desiredCompletionDate).toLocaleDateString("en-CA", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Not set</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Revisions</span>
                  <span className="font-medium flex items-center gap-1">
                    <RotateCcw className="size-3.5 text-muted-foreground" />
                    {details.revisionCount > 0 ? `${details.revisionCount} requested` : "None"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {details.attachments && details.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Paperclip className="size-4" /> Attachments
                  <span className="ml-auto text-xs font-normal text-muted-foreground">
                    {details.attachments.length} file{details.attachments.length !== 1 ? "s" : ""}
                  </span>
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="p-0">
                {details.attachments.map((att, i) => (
                  <div key={att.id}>
                    {i > 0 && <Separator />}
                    <a
                      href={att.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors group"
                    >
                      <Paperclip className="size-4 text-muted-foreground shrink-0" />
                      <span className="flex-1 text-sm font-medium truncate group-hover:underline">
                        {att.label || `Attachment ${i + 1}`}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(att.createdAt).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
                      </span>
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Progress + approve/revision actions */}
          <JobProgressView
            jobId={Number(id)}
            initialProgress={progressData}
            isWaitingApproval={isWaitingApproval}
            isCompleted={isCompleted}
            expertName={details.expertName}
          />
        </div>

        {/* ── Right: sidebar ── */}
        <div className="flex flex-col gap-6">

          {/* Expert card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Expert</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <Avatar className="size-11 shrink-0">
                  <AvatarImage src={details.expertAvatarUrl ?? undefined} alt={details.expertName} />
                  <AvatarFallback>{expertInitials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{details.expertName}</p>
                  {details.expertTitle && (
                    <p className="text-xs text-muted-foreground truncate">{details.expertTitle}</p>
                  )}
                  {details.expertProfession && !details.expertTitle && (
                    <p className="text-xs text-muted-foreground truncate">{details.expertProfession}</p>
                  )}
                  {details.expertBusinessName && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                      <Building2 className="size-3 shrink-0" /> {details.expertBusinessName}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                <Link href="/chat">
                  <MessageSquare className="size-3.5" /> Message Expert
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Payment summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="size-4" /> Payment
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 flex flex-col gap-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Agreed price</span>
                <span className="font-semibold flex items-center gap-1">
                  <DollarSign className="size-3.5 text-muted-foreground" />
                  {Number(details.finalQuotedPrice).toLocaleString("en-CA", { minimumFractionDigits: 2 })} CAD
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment status</span>
                <span className={`flex items-center gap-1 font-medium ${payoutCfg.className}`}>
                  <PayoutIcon className="size-3.5" />
                  {payoutCfg.label}
                </span>
              </div>

              {isCompleted && (
                <>
                  <Separator />
                  <MissionDocuments missionId={details.id} />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
