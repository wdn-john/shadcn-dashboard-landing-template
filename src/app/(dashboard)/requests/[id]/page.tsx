import { notFound } from "next/navigation"
import Link from "next/link"
import { serverGet } from "@/lib/server/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Star,
  Briefcase,
} from "lucide-react"
import { T } from "@/components/t"

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

type ServiceRequest = {
  id: number
  issue: string
  description: string
  category: string
  priority: string
  budget: number | null
  budgetOption: string
  workLocation: string
  status: string
  createdAt: string
  desiredCompletionDate: string | null
  address: {
    city?: string
    region?: string
    street?: string
    postalCode?: string
    country?: string
  } | null
  // Each application entry embeds the Application entity ID (different from service request ID)
  application: { id: number }
}

function priorityVariant(p: string) {
  switch (p) {
    case "High":
      return "destructive" as const
    case "Medium":
      return "secondary" as const
    default:
      return "outline" as const
  }
}

function statusBadgeVariant(s: string) {
  switch (s) {
    case "Pending":
      return "secondary" as const
    case "Accepted":
      return "default" as const
    case "Rejected":
      return "destructive" as const
    default:
      return "outline" as const
  }
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const request = await serverGet<ServiceRequest>(`/service-requests/${id}`)
  console.log("Fetched request", request) // Debug log
  if (!request) notFound()

  // The /applications/applicants/ endpoint expects the Application entity ID,
  // not the service request ID. Each application entry includes the applicationId.
  const applicationEntityId = request.application?.id
  const applicants = applicationEntityId
    ? await serverGet<ApplicantEntry[]>(
        `/applications/applicants/${applicationEntityId}`
      )
    : null

  const applicantList = applicants ?? []

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-4xl">
      {/* Back */}
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link
            href="/requests"
            className="flex items-center gap-1 text-muted-foreground"
          >
            <ArrowLeft className="size-3" /> <T k="requests.title" />
          </Link>
        </Button>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">
            {request.issue || request.description}
          </h1>
          <Badge
            variant={
              request.status === "Open"
                ? "default"
                : request.status === "In Progress"
                ? "secondary"
                : "outline"
            }
            className="shrink-0 mt-1"
          >
            {request.status}
          </Badge>
        </div>
      </div>

      {/* Request details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base"><T k="requests.detail.requestDetails" /></CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {request.description}
          </p>

          <Separator />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                <T k="requests.detail.category" />
              </span>
              <span className="font-medium">{request.category ?? "—"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                <T k="requests.detail.priority" />
              </span>
              <Badge
                variant={priorityVariant(request.priority)}
                className="w-fit text-xs"
              >
                {request.priority ?? "—"}
              </Badge>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                <T k="requests.detail.workLocation" />
              </span>
              <span className="font-medium flex items-center gap-1">
                <MapPin className="size-3 text-muted-foreground" />
                {request.workLocation ?? "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                <T k="requests.detail.budget" />
              </span>
              <span className="font-medium flex items-center gap-1">
                <DollarSign className="size-3 text-muted-foreground" />
                {request.budget != null
                  ? `$${Number(request.budget).toLocaleString()} (${
                      request.budgetOption
                    })`
                  : request.budgetOption ?? "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                <T k="requests.detail.posted" />
              </span>
              <span className="font-medium flex items-center gap-1">
                <Calendar className="size-3 text-muted-foreground" />
                {request.createdAt
                  ? new Date(request.createdAt).toLocaleDateString("en-CA", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </span>
            </div>
            {request.desiredCompletionDate && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  <T k="requests.detail.desiredBy" />
                </span>
                <span className="font-medium">
                  {new Date(request.desiredCompletionDate).toLocaleDateString(
                    "en-CA",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>
            )}
            {request.address?.city && (
              <div className="flex flex-col gap-1 col-span-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  <T k="requests.detail.location" />
                </span>
                <span className="font-medium">
                  {[
                    request.address.city,
                    request.address.region,
                    request.address.postalCode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Applicants */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="size-4" />
                <T k="requests.detail.applicants" />
              </CardTitle>
              <CardDescription>
                {applicantList.length === 0
                  ? <T k="requests.detail.noApplicationsYet" />
                  : <T
                      k={applicantList.length === 1 ? "requests.detail.expertApplied" : "requests.detail.expertsApplied"}
                      values={{ n: applicantList.length }}
                    />}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {applicantList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              <Briefcase className="size-10 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">
                <T k="requests.detail.noExpertsHint" />
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y">
              {applicantList.map((entry) => (
                <div
                  key={entry.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-start gap-4"
                >
                  <Avatar className="size-10 shrink-0">
                    <AvatarImage
                      src={entry.avatarUrl ?? undefined}
                      alt={entry.fullName}
                    />
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
                      <Badge
                        variant={statusBadgeVariant(entry.status)}
                        className="text-xs"
                      >
                        {entry.status}
                      </Badge>
                      {entry.chosen && (
                        <Badge variant="default" className="text-xs">
                          <T k="requests.detail.selected" />
                        </Badge>
                      )}
                    </div>

                    {entry.message && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {entry.message}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                      {entry.bid && (
                        <span className="font-medium text-foreground">
                          ${Number(entry.bid).toLocaleString()}
                        </span>
                      )}
                      {entry.estimatedDelivery && (
                        <span>
                          <T k="requests.detail.delivery" values={{ date: entry.estimatedDelivery }} />
                        </span>
                      )}
                      {entry.allowedRevisions > 0 && (
                        <span>
                          <T
                            k={entry.allowedRevisions === 1 ? "requests.detail.revision" : "requests.detail.revisions"}
                            values={{ n: entry.allowedRevisions }}
                          />
                        </span>
                      )}
                      <span>
                        <T
                          k="requests.detail.applied"
                          values={{
                            date: new Date(entry.createdAt).toLocaleDateString("en-CA", {
                              month: "short",
                              day: "numeric",
                            }),
                          }}
                        />
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/requests/${id}/applicants/${entry.id}`}>
                        <T k="requests.detail.viewProfile" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
