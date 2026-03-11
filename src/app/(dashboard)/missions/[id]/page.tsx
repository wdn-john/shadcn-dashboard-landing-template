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
  MapPin,
  DollarSign,
  CalendarDays,
  Clock,
  Monitor,
  Building2,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  CreditCard,
  RotateCcw,
} from "lucide-react"
import { MissionTracker } from "./components/mission-tracker"
import { MissionDocuments } from "@/components/mission-documents"
import type { MissionDetailsDTO } from "@/types/MissionDetailsDTO"
import type { MissionProgressDTO } from "@/types/MissionProgress"
import type { InstallmentStatus } from "@/types/PaymentDTO"
import { T } from "@/components/t"

function priorityVariant(p: string) {
  switch (p) {
    case "HIGH": return "destructive" as const
    case "MEDIUM": return "secondary" as const
    default: return "outline" as const
  }
}

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const details = await serverGet<MissionDetailsDTO>(`/missions/${id}/details`)
  if (!details) notFound()

  const progress = await serverGet<MissionProgressDTO>(
    `/missions/${details.progressId}/progress`
  ).catch(() => null)

  const clientInitials =
    details.clientName
      ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?"

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

  const installments = details.paymentDetails?.installments ?? []
  const isCompleted = details.status === "COMPLETED"
  const isWaitingApproval =
    details.status === "WAITING_APPROVAL" || details.status === "WAITING_PHASE_APPROVAL"

  const missionStatusVariant = (s: string) => {
    switch (s) {
      case "IN_PROGRESS": return "secondary" as const
      case "COMPLETED": return "default" as const
      case "WAITING_APPROVAL":
      case "WAITING_PHASE_APPROVAL": return "outline" as const
      default: return "outline" as const
    }
  }

  const missionStatusKey = (s: string) => {
    if (s === "WAITING_APPROVAL" || s === "WAITING_PHASE_APPROVAL") return "missions.status.WAITING_APPROVAL"
    return `missions.status.${s}`
  }

  const payoutVariantClass = (s: string) => {
    switch (s) {
      case "COMPLETED": return "text-green-600 dark:text-green-400"
      case "TRANSFERRING": return "text-blue-600 dark:text-blue-400"
      case "FAILED": return "text-destructive"
      case "ON_HOLD": return "text-amber-600 dark:text-amber-400"
      default: return "text-muted-foreground"
    }
  }

  const payoutIcon = (s: string) => {
    switch (s) {
      case "COMPLETED": return CheckCircle2
      case "TRANSFERRING": return Clock
      case "FAILED": return AlertCircle
      case "ON_HOLD": return Clock
      default: return Clock
    }
  }

  const PayoutIcon = payoutIcon(details.payoutStatus)

  const installmentStatusClass = (status: InstallmentStatus) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
      case "PROCESSING": return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
      case "FAILED": return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
      case "CANCELLED": return "bg-muted text-muted-foreground"
      default: return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-5xl">

      {/* Back + Header */}
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link href="/missions" className="flex items-center gap-1 text-muted-foreground">
            <ArrowLeft className="size-3" /> <T k="missions.backToMissions" />
          </Link>
        </Button>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h1 className="text-2xl font-bold tracking-tight">{details.title}</h1>
          <div className="flex gap-2 flex-wrap">
            <Badge variant={missionStatusVariant(details.status)}>
              <T k={missionStatusKey(details.status)} />
            </Badge>
            <Badge variant={priorityVariant(details.priority)}>{details.priority}</Badge>
            <Badge variant="outline">{details.workLocation.replace("_", " ")}</Badge>
          </div>
        </div>
        {daysLeft !== null && (
          <p className={`text-sm mt-1 flex items-center gap-1.5 ${daysLeft < 0 ? "text-destructive" : daysLeft <= 3 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>
            <CalendarDays className="size-3.5" />
            {daysLeft < 0
              ? <T k="missions.daysOverdue" values={{ n: Math.abs(daysLeft) }} />
              : daysLeft === 0
              ? <T k="missions.dueToday" />
              : <T k="missions.daysRemaining" values={{ n: daysLeft }} />}
          </p>
        )}
      </div>

      {/* Status banners */}
      {isWaitingApproval && (
        <div className="rounded-xl border border-teal-200 bg-teal-50/70 dark:border-teal-800 dark:bg-teal-950/30 px-4 py-4 flex gap-3">
          <Clock className="size-5 shrink-0 text-teal-600 dark:text-teal-400 mt-0.5" />
          <div>
            <p className="font-semibold text-teal-800 dark:text-teal-300"><T k="missions.awaiting.title" /></p>
            <p className="text-sm text-teal-700 dark:text-teal-400 mt-0.5">
              <T k="missions.awaiting.desc" />
            </p>
          </div>
        </div>
      )}
      {isCompleted && (
        <div className="rounded-xl border border-green-200 bg-green-50/70 dark:border-green-800 dark:bg-green-950/30 px-4 py-4 flex gap-3">
          <CheckCircle2 className="size-5 shrink-0 text-green-600 dark:text-green-400 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800 dark:text-green-300"><T k="missions.approved.title" /></p>
            <p className="text-sm text-green-700 dark:text-green-400 mt-0.5">
              <T k="missions.approved.desc" />
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
              <CardTitle className="text-base"><T k="missions.detail.description" /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{details.description}</p>
            </CardContent>
          </Card>

          {/* Project details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base"><T k="missions.detail.projectDetails" /></CardTitle>
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
                    {details.workLocation === "REMOTE"
                      ? <T k="missions.detail.remote" />
                      : details.workLocation === "ON_SITE"
                      ? <T k="missions.detail.onSite" />
                      : <T k="missions.detail.flexible" />}
                  </p>
                  {details.workLocation === "REMOTE" && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      <T k="missions.detail.remoteNote" />
                    </p>
                  )}
                  {details.workLocation === "ON_SITE" && fullAddress && (
                    <p className="text-xs text-muted-foreground mt-0.5">{fullAddress}</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    <T k="missions.detail.dueDate" />
                  </span>
                  {details.desiredCompletionDate ? (
                    <span className="font-medium flex items-center gap-1">
                      <CalendarDays className="size-3.5 text-muted-foreground" />
                      {new Date(details.desiredCompletionDate).toLocaleDateString("en-CA", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </span>
                  ) : (
                    <span className="text-muted-foreground"><T k="missions.detail.notSet" /></span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    <T k="missions.detail.revisions" />
                  </span>
                  <span className="font-medium flex items-center gap-1">
                    <RotateCcw className="size-3.5 text-muted-foreground" />
                    {details.revisionCount > 0
                      ? <T k="missions.detail.revisionsRequested" values={{ n: details.revisionCount }} />
                      : <T k="missions.detail.noRevisions" />}
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
                  <Paperclip className="size-4" /> <T k="missions.detail.attachments" />
                  <span className="ml-auto text-xs font-normal text-muted-foreground">
                    <T k={details.attachments.length === 1 ? "missions.detail.file" : "missions.detail.files"} values={{ n: details.attachments.length }} />
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
                        {att.label || <T k="missions.detail.attachment" values={{ n: i + 1 }} />}
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

          {/* Mission Tracker */}
          <MissionTracker
            missionId={Number(id)}
            missionEntityId={details.id}
            initialProgress={progress}
            allStepsCompleted={details.allMissionStepsCompleted}
            clientName={details.clientName}
          />
        </div>

        {/* ── Right: sidebar ── */}
        <div className="flex flex-col gap-6">

          {/* Client card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base"><T k="missions.detail.clientCard" /></CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <Avatar className="size-11 shrink-0">
                  <AvatarImage src={details.clientAvatarUrl ?? undefined} alt={details.clientName} />
                  <AvatarFallback>{clientInitials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{details.clientName}</p>
                  {details.clientTitle && (
                    <p className="text-xs text-muted-foreground truncate">{details.clientTitle}</p>
                  )}
                  {details.clientBusinessName && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                      <Building2 className="size-3 shrink-0" /> {details.clientBusinessName}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                <Link href="/chat">
                  <MessageSquare className="size-3.5" /> <T k="missions.detail.messageClient" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Payment summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="size-4" /> <T k="missions.detail.payment" />
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 flex flex-col gap-3 text-sm">
              {/* Agreed price */}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground"><T k="missions.detail.agreedPrice" /></span>
                <span className="font-semibold flex items-center gap-1">
                  <DollarSign className="size-3.5 text-muted-foreground" />
                  {Number(details.finalQuotedPrice).toLocaleString("en-CA", { minimumFractionDigits: 2 })} CAD
                </span>
              </div>

              {/* Payout status */}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground"><T k="missions.detail.payoutStatus" /></span>
                <span className={`flex items-center gap-1 font-medium ${payoutVariantClass(details.payoutStatus)}`}>
                  <PayoutIcon className="size-3.5" />
                  <T k={`missions.payout.${details.payoutStatus}`} />
                </span>
              </div>

              {/* Installments */}
              {installments.length > 0 && (
                <>
                  <Separator />
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                      <T k="missions.detail.installments" values={{ n: installments.length }} />
                    </p>
                    {installments.map((inst, i) => (
                      <div key={inst.id} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="flex size-5 items-center justify-center rounded-full bg-muted text-xs font-semibold shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ${Number(inst.expertPayoutAmount).toLocaleString("en-CA", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${installmentStatusClass(inst.expertPayoutAmountTransferStatus)}`}>
                          <T k={`missions.installment.${inst.expertPayoutAmountTransferStatus}`} />
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {details.payoutStatus === "COMPLETED" && (
                <p className="text-xs text-muted-foreground bg-muted/60 rounded-md px-3 py-2 leading-relaxed">
                  <T k="missions.detail.paymentNote" />
                </p>
              )}

              {/* Receipt & Earnings documents — shown when completed */}
              {isCompleted && (
                <>
                  <Separator />
                  <MissionDocuments missionId={details.id} showEarnings />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
