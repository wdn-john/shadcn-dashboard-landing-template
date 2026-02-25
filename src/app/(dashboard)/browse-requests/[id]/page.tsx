import { notFound } from "next/navigation"
import Link from "next/link"
import { serverGet } from "@/lib/server/api"
import { getSession } from "@/lib/server/getSession"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Calendar, DollarSign, Users, Clock } from "lucide-react"
import { ApplyForm } from "./components/apply-form"

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
  applications: unknown[]
  address: {
    city?: string
    region?: string
    street?: string
    postalCode?: string
    country?: string
  } | null
}

type ApplicationCheck = {
  exists: boolean
}

function priorityVariant(p: string) {
  switch (p) {
    case "High": return "destructive" as const
    case "Medium": return "secondary" as const
    default: return "outline" as const
  }
}

export default async function BrowseRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession()

  const [request, applicationCheck] = await Promise.all([
    serverGet<ServiceRequest>(`/service-requests/${id}`),
    serverGet<ApplicationCheck>(`/applications/exists?serviceRequestId=${id}`),
  ])

  if (!request) notFound()

  const alreadyApplied = applicationCheck?.exists ?? false
  const applicantCount = Array.isArray(request.applications) ? request.applications.length : 0
  const firstName = session.profile?.firstName

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-3xl">
      {/* Back */}
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link href="/browse-requests" className="flex items-center gap-1 text-muted-foreground">
            <ArrowLeft className="size-3" /> Browse Requests
          </Link>
        </Button>
      </div>

      {/* Header card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {request.category}
                </span>
                <Badge variant={priorityVariant(request.priority)} className="text-xs">
                  {request.priority} priority
                </Badge>
                <Badge variant="default" className="text-xs">{request.status}</Badge>
              </div>
              <CardTitle className="text-xl leading-snug">
                {request.issue || request.description}
              </CardTitle>
            </div>
            <div className="shrink-0">
              <ApplyForm
                serviceRequestId={request.id}
                budgetOption={request.budgetOption}
                alreadyApplied={alreadyApplied}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Budget</span>
              <span className="font-medium flex items-center gap-1">
                <DollarSign className="size-3 text-muted-foreground" />
                {request.budget != null
                  ? `$${Number(request.budget).toLocaleString()}`
                  : request.budgetOption}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Location</span>
              <span className="font-medium flex items-center gap-1">
                <MapPin className="size-3 text-muted-foreground" />
                {request.workLocation}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Applicants</span>
              <span className="font-medium flex items-center gap-1">
                <Users className="size-3 text-muted-foreground" />
                {applicantCount}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Posted</span>
              <span className="font-medium flex items-center gap-1">
                <Calendar className="size-3 text-muted-foreground" />
                {request.createdAt
                  ? new Date(request.createdAt).toLocaleDateString("en-CA", {
                      month: "short", day: "numeric", year: "numeric",
                    })
                  : "—"}
              </span>
            </div>
            {request.desiredCompletionDate && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Desired By</span>
                <span className="font-medium flex items-center gap-1">
                  <Clock className="size-3 text-muted-foreground" />
                  {new Date(request.desiredCompletionDate).toLocaleDateString("en-CA", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </span>
              </div>
            )}
            {request.address?.city && (
              <div className="flex flex-col gap-1 col-span-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">City</span>
                <span className="font-medium">
                  {[request.address.city, request.address.region]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Full description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Full Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {request.description}
          </p>
        </CardContent>
      </Card>

      {/* Apply CTA (bottom) */}
      {!alreadyApplied && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="font-semibold text-sm">Ready to help?</p>
              <p className="text-xs text-muted-foreground">Submit your proposal and expertise.</p>
            </div>
            <ApplyForm
              serviceRequestId={request.id}
              budgetOption={request.budgetOption}
              alreadyApplied={alreadyApplied}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
