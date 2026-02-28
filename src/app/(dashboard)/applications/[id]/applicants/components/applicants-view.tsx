"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Star, Users, Briefcase } from "lucide-react"

type ApplicantEntry = {
  id: number
  fullName: string
  avatarUrl: string | null
  message: string | null
  estimatedDelivery: string | null
  allowedRevisions: number
  bid: string
  chosen: boolean | null
  averageRating: number
  createdAt: string
  status: "Pending" | "Accepted" | "Rejected"
}

type FilterKey = "All" | "Pending" | "Accepted" | "Rejected"

const FILTERS: FilterKey[] = ["All", "Pending", "Accepted", "Rejected"]

function statusBadgeVariant(s: string): "default" | "secondary" | "outline" | "destructive" {
  switch (s) {
    case "Pending": return "secondary"
    case "Accepted": return "default"
    case "Rejected": return "destructive"
    default: return "outline"
  }
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export function ApplicantsView({
  applicationId,
  initialApplicants,
}: {
  applicationId: number
  initialApplicants: ApplicantEntry[]
}) {
  const [filter, setFilter] = useState<FilterKey>("All")

  const filtered =
    filter === "All"
      ? initialApplicants
      : initialApplicants.filter((a) => a.status === filter)

  const counts: Record<FilterKey, number> = {
    All: initialApplicants.length,
    Pending: initialApplicants.filter((a) => a.status === "Pending").length,
    Accepted: initialApplicants.filter((a) => a.status === "Accepted").length,
    Rejected: initialApplicants.filter((a) => a.status === "Rejected").length,
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="-ml-2">
          <Link href="/applications">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Applicants</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {initialApplicants.length === 0
              ? "No one has applied yet."
              : `${initialApplicants.length} expert${initialApplicants.length !== 1 ? "s" : ""} applied`}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      {initialApplicants.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="gap-1.5"
            >
              {f}
              {counts[f] > 0 && (
                <span className={`text-xs rounded-full px-1.5 py-0 ${
                  filter === f
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {counts[f]}
                </span>
              )}
            </Button>
          ))}
        </div>
      )}

      {/* List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="size-4" />
            {filter === "All" ? "All Applicants" : `${filter} Applicants`}
          </CardTitle>
          <CardDescription>
            {filtered.length === 0
              ? `No ${filter.toLowerCase()} applicants`
              : `${filtered.length} applicant${filtered.length !== 1 ? "s" : ""}`}
          </CardDescription>
        </CardHeader>
        <Separator />
        {filtered.length === 0 ? (
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Briefcase className="size-7 text-muted-foreground" />
            <p className="font-medium text-sm text-muted-foreground">
              {initialApplicants.length === 0
                ? "No experts have applied yet. Check back soon."
                : `No ${filter.toLowerCase()} applicants.`}
            </p>
          </CardContent>
        ) : (
          <CardContent className="p-0">
            {filtered.map((entry, i) => (
              <div key={entry.id}>
                {i > 0 && <Separator />}
                <div className="flex gap-4 px-5 py-4">
                  <Avatar className="size-10 shrink-0">
                    <AvatarImage src={entry.avatarUrl ?? undefined} alt={entry.fullName} />
                    <AvatarFallback>{initials(entry.fullName)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{entry.fullName}</p>
                      {entry.averageRating > 0 && (
                        <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          {entry.averageRating.toFixed(1)}
                        </span>
                      )}
                      <Badge variant={statusBadgeVariant(entry.status)} className="text-xs">
                        {entry.status}
                      </Badge>
                      {entry.chosen && (
                        <Badge variant="default" className="text-xs">Selected</Badge>
                      )}
                    </div>

                    {entry.message && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{entry.message}</p>
                    )}

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                      {entry.bid && (
                        <span className="font-medium text-foreground">
                          ${Number(entry.bid).toLocaleString()}
                        </span>
                      )}
                      {entry.estimatedDelivery && (
                        <span>
                          Delivery:{" "}
                          {new Date(entry.estimatedDelivery).toLocaleDateString("en-CA", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </span>
                      )}
                      {entry.allowedRevisions > 0 && (
                        <span>
                          {entry.allowedRevisions} revision{entry.allowedRevisions !== 1 ? "s" : ""}
                        </span>
                      )}
                      <span>
                        Applied{" "}
                        {new Date(entry.createdAt).toLocaleDateString("en-CA", {
                          month: "short", day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/applications/${applicationId}/applicants/${entry.id}`}>
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
