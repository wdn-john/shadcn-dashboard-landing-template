"use client"

import Link from "next/link"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowRight, FileText } from "lucide-react"
import { formatDistanceToNow, parseISO } from "date-fns"
import type { ApplicationSummary } from "../page"

type Props = {
  initialItems: ApplicationSummary[]
  totalElements: number
}

type StatusConfig = {
  label: string
  variant: "default" | "secondary" | "outline" | "destructive"
}

const statusMap: Record<string, StatusConfig> = {
  PENDING:    { label: "Pending",   variant: "secondary" },
  REVIEWING:  { label: "Reviewing", variant: "default" },
  ACCEPTED:   { label: "Accepted",  variant: "outline" },
  REJECTED:   { label: "Rejected",  variant: "destructive" },
  WITHDRAWN:  { label: "Withdrawn", variant: "secondary" },
  CHOSEN:     { label: "Chosen",    variant: "outline" },
}

function statusConfig(status: string): StatusConfig {
  return statusMap[status?.toUpperCase()] ?? { label: status, variant: "secondary" }
}

function formatApplied(dateStr: string) {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true })
  } catch {
    return dateStr
  }
}

export function ApplicationsList({ initialItems, totalElements }: Props) {
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all")

  const filtered = initialItems.filter(item => {
    const s = item.status?.toUpperCase()
    if (filter === "active") return s === "PENDING" || s === "REVIEWING"
    if (filter === "closed") return s === "ACCEPTED" || s === "REJECTED" || s === "WITHDRAWN" || s === "CHOSEN"
    return true
  })

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Applications</h1>
        <p className="text-muted-foreground mt-1">{totalElements} application{totalElements !== 1 ? "s" : ""} submitted</p>
      </div>

      <div className="flex gap-2">
        {(["all", "active", "closed"] as const).map(f => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <FileText className="size-8 text-muted-foreground" />
            <p className="font-medium">No applications yet</p>
            <p className="text-sm text-muted-foreground">Browse open requests and submit your first application.</p>
            <Button asChild className="mt-2">
              <Link href="/browse-requests">Browse Requests</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map(item => {
            const cfg = statusConfig(item.status)
            return (
              <Card key={item.id} className="transition-colors hover:bg-muted/30">
                <CardContent className="flex items-center gap-4 py-4 px-6">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.category} · Applied {formatApplied(item.appliedAgo)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {item.amount != null && (
                      <span className="text-sm font-medium tabular-nums hidden sm:block">
                        ${item.amount.toLocaleString()}
                      </span>
                    )}
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    <Button size="icon" variant="ghost" className="size-8" asChild>
                      <Link href={`/applications/${item.id}`}>
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
