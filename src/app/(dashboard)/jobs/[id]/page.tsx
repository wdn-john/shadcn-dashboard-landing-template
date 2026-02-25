import { notFound } from "next/navigation"
import { serverGet } from "@/lib/server/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ArrowLeft, DollarSign, CalendarDays } from "lucide-react"
import { JobProgressView } from "./components/job-progress-view"

type JobDetails = {
  id: number
  title: string
  description: string
  status: string
  expertName: string
  expertAvatarUrl: string | null
  expertProfession: string
  finalQuotedPrice: number
  desiredCompletionDate: string | null
  revisionCount: number
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

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [details, progressData] = await Promise.all([
    serverGet<JobDetails>(`/jobs/${id}/details`),
    serverGet<JobProgressDTO>(`/jobs/${id}/progress`).catch(() => null),
  ])

  if (!details) notFound()

  const expertInitials = details.expertName
    ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?"

  const isWaitingApproval =
    details.status === "WAITING_APPROVAL" || details.status === "WAITING_PHASE_APPROVAL"

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-3xl">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link href="/jobs" className="flex items-center gap-1 text-muted-foreground">
            <ArrowLeft className="size-3" /> Work in Progress
          </Link>
        </Button>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h1 className="text-2xl font-bold tracking-tight">{details.title}</h1>
          <Badge variant={isWaitingApproval ? "secondary" : "outline"}>
            {isWaitingApproval ? "Awaiting Your Approval" : details.status.replace("_", " ")}
          </Badge>
        </div>
      </div>

      {/* Expert + price info */}
      <Card>
        <CardHeader><CardTitle className="text-base">Mission Info</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarImage src={details.expertAvatarUrl ?? undefined} alt={details.expertName} />
              <AvatarFallback>{expertInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{details.expertName}</p>
              {details.expertProfession && (
                <p className="text-xs text-muted-foreground">{details.expertProfession}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Quoted Price</span>
              <span className="font-semibold flex items-center gap-1">
                <DollarSign className="size-3.5 text-muted-foreground" />
                ${Number(details.finalQuotedPrice).toLocaleString("en-CA", { minimumFractionDigits: 2 })} CAD
              </span>
            </div>
            {details.desiredCompletionDate && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Due Date</span>
                <span className="font-medium flex items-center gap-1">
                  <CalendarDays className="size-3.5 text-muted-foreground" />
                  {new Date(details.desiredCompletionDate).toLocaleDateString("en-CA", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </span>
              </div>
            )}
            {details.revisionCount > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Revisions</span>
                <span className="font-medium">{details.revisionCount}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress + actions */}
      <JobProgressView
        jobId={Number(id)}
        initialProgress={progressData}
        isWaitingApproval={isWaitingApproval}
        isCompleted={details.status === "COMPLETED"}
        expertName={details.expertName}
      />
    </div>
  )
}
