"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronRight } from "lucide-react"
import { useJobSyncStore } from "@/store/jobSyncStore"
import { useTranslation } from "react-i18next"

type JobListItem = {
  id: number
  title: string
  progress: number
  expertName: string
  status: string
}

function statusVariant(s: string) {
  if (s.includes("WAITING")) return "secondary" as const
  if (s === "COMPLETED")     return "default" as const
  if (s === "IN_PROGRESS")   return "outline" as const
  return "outline" as const
}

export function JobList({ initialJobs }: { initialJobs: JobListItem[] }) {
  const { t } = useTranslation()
  const [jobs, setJobs] = useState(initialJobs)

  const syncedJobDetails = useJobSyncStore((s) => s.syncedJobDetails)
  const syncedJobProgress = useJobSyncStore((s) => s.syncedJobProgress)

  useEffect(() => {
    if (!syncedJobDetails) return
    setJobs((prev) =>
      prev.map((job) =>
        job.id === syncedJobDetails.id
          ? {
              ...job,
              status: syncedJobDetails.status ?? job.status,
              progress: syncedJobProgress?.completionPercentage ?? job.progress,
            }
          : job
      )
    )
  }, [syncedJobDetails, syncedJobProgress])

  function statusLabel(s: string) {
    switch (s) {
      case "IN_PROGRESS":            return t("jobs.status.IN_PROGRESS")
      case "WAITING_APPROVAL":       return t("jobs.status.WAITING_APPROVAL")
      case "WAITING_PHASE_APPROVAL": return t("jobs.status.WAITING_PHASE_APPROVAL")
      case "COMPLETED":              return t("jobs.status.COMPLETED")
      default:                       return s
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {jobs.map((job) => (
        <Link key={job.id} href={`/jobs/${job.id}`}>
          <Card className="hover:bg-muted/40 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="font-semibold text-sm truncate">{job.title}</p>
                  <Badge variant={statusVariant(job.status)} className="text-xs shrink-0">
                    {statusLabel(job.status)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{t("jobs.expert", { name: job.expertName })}</p>
                <div className="flex items-center gap-2">
                  <Progress value={job.progress} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground shrink-0">{job.progress}%</span>
                </div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground shrink-0" />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
