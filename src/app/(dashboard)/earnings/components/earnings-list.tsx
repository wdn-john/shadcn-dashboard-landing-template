"use client"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Briefcase } from "lucide-react"
import { useTranslation } from "react-i18next"

export type JobDetail = {
  id: string
  title: string
  ownerName: string
  amount: number
  status: "COMPLETED" | "PENDING"
  paidAt?: string
}

interface Props {
  jobs: JobDetail[]
  loading: boolean
  hasMore: boolean
  onLoadMore: () => void
  loadingMore: boolean
}

export function EarningsList({ jobs, loading, hasMore, onLoadMore, loadingMore }: Props) {
  const { t } = useTranslation()

  if (loading && jobs.length === 0) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    )
  }

  if (!loading && jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center text-muted-foreground">
        <Briefcase className="h-8 w-8 opacity-40" />
        <p className="text-sm">{t("earnings.noEarnings")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/30 transition-colors"
        >
          <div className="min-w-0">
            <p className="truncate font-medium text-sm">{job.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {job.ownerName}
              {job.paidAt && (
                <> · {format(new Date(job.paidAt), "MMM d, yyyy")}</>
              )}
            </p>
          </div>

          <div className="ml-4 flex items-center gap-3 shrink-0">
            <Badge
              variant={job.status === "COMPLETED" ? "default" : "secondary"}
              className="text-xs"
            >
              {job.status === "COMPLETED" ? t("payments.status.COMPLETED") : t("payments.status.PENDING")}
            </Badge>
            <span className="font-semibold text-sm">${job.amount.toFixed(2)}</span>
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" onClick={onLoadMore} disabled={loadingMore}>
            {loadingMore ? t("common.loading") : t("common.loadMore")}
          </Button>
        </div>
      )}
    </div>
  )
}
