"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DollarSign, Briefcase, Clock } from "lucide-react"

export type PaymentSummary = {
  totalSpent: number
  totalJobs: number
  pendingAmount: number
}

interface Props {
  summary: PaymentSummary | null
  loading: boolean
}

export function PaymentsSummaryCard({ summary, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
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

  const stats = [
    {
      label: "Total Spent",
      value: `$${summary.totalSpent.toFixed(2)}`,
      icon: DollarSign,
      sub: "All time",
    },
    {
      label: "Jobs Hired",
      value: summary.totalJobs.toString(),
      icon: Briefcase,
      sub: "Completed missions",
    },
    {
      label: "Pending",
      value: `$${summary.pendingAmount.toFixed(2)}`,
      icon: Clock,
      sub: "Pre-authorized",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map(({ label, value, icon: Icon, sub }) => (
        <Card key={label}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
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
