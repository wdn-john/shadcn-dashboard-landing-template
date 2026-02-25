"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown, Briefcase, Star, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

export type EarningsSummary = {
  total: number
  growth: number
  jobsCompleted: number
  avgRating: number
  avgPerJob: number
}

interface Props {
  summary: EarningsSummary | null
  loading: boolean
}

export function EarningsSummaryCard({ summary, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!summary) return null

  const isPositiveGrowth = summary.growth >= 0

  const stats = [
    {
      label: "Total Earned",
      value: `$${summary.total.toFixed(2)}`,
      icon: DollarSign,
      sub: (
        <span className={cn("flex items-center gap-1 text-xs", isPositiveGrowth ? "text-green-600" : "text-red-500")}>
          {isPositiveGrowth ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(summary.growth).toFixed(1)}% vs last month
        </span>
      ),
    },
    {
      label: "Jobs Completed",
      value: summary.jobsCompleted.toString(),
      icon: Briefcase,
      sub: <span className="text-xs text-muted-foreground">All time</span>,
    },
    {
      label: "Avg per Job",
      value: `$${summary.avgPerJob.toFixed(2)}`,
      icon: DollarSign,
      sub: <span className="text-xs text-muted-foreground">Average payout</span>,
    },
    {
      label: "Avg Rating",
      value: summary.avgRating.toFixed(1),
      icon: Star,
      sub: <span className="text-xs text-muted-foreground">From clients</span>,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, sub }) => (
        <Card key={label}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
                <div className="mt-1">{sub}</div>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <Icon className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
