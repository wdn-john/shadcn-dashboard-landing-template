import { notFound } from "next/navigation"
import { serverGet } from "@/lib/server/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  ArrowLeft,
  Star,
  CalendarDays,
  Clock,
  DollarSign,
  MapPin,
  MessageSquare,
  ShieldCheck,
} from "lucide-react"
import { ApplicantActions } from "./components/applicant-actions"

type EntryDetail = {
  id: number
  applicationId: number
  applicant: {
    id: string
    firstName?: string
    lastName?: string
    fullName?: string
    avatarUrl?: string
    title?: string
    city?: string
    province?: string
    skills?: { id: string; name: string }[]
    certifications?: { id?: string; name: string }[]
    accountStatus?: string
  }
  serviceRequest: {
    id: number
    issue: string
    budget: number | null
    budgetOption: string
  }
  message: string
  bid: number
  availability: string
  estimatedDelivery: string
  allowedRevisions: number
  averageRating: number
  numberOfReviews: number
  status: "Pending" | "Accepted" | "Rejected"
  createdAt: string
}

function initials(entry: EntryDetail) {
  const name = entry.applicant?.fullName
    ?? [entry.applicant?.firstName, entry.applicant?.lastName].filter(Boolean).join(" ")
    ?? "?"
  return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
}

function displayName(entry: EntryDetail) {
  return entry.applicant?.fullName
    ?? [entry.applicant?.firstName, entry.applicant?.lastName].filter(Boolean).join(" ")
    ?? "Unknown Expert"
}

export default async function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string; entryId: string }>
}) {
  const { id, entryId } = await params

  const entry = await serverGet<EntryDetail>(`/applications/entries/${entryId}`)
  if (!entry) notFound()

  const name = displayName(entry)
  const location = [entry.applicant?.city, entry.applicant?.province].filter(Boolean).join(", ")

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-3xl">
      {/* Back */}
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link href={`/requests/${id}`} className="flex items-center gap-1 text-muted-foreground">
            <ArrowLeft className="size-3" /> Back to Applicants
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Applicant Profile</h1>
      </div>

      {/* Profile card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="size-16 shrink-0">
              <AvatarImage src={entry.applicant?.avatarUrl} alt={name} />
              <AvatarFallback className="text-xl">{initials(entry)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold">{name}</h2>
                {entry.applicant?.accountStatus === "APPROVED" && (
                  <Badge variant="outline" className="gap-1 text-xs border-green-500 text-green-600">
                    <ShieldCheck className="size-3" /> Verified
                  </Badge>
                )}
              </div>
              {entry.applicant?.title && (
                <p className="text-sm text-muted-foreground">{entry.applicant.title}</p>
              )}
              {location && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="size-3" /> {location}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                {entry.averageRating > 0 && (
                  <span className="flex items-center gap-1 text-sm">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{entry.averageRating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({entry.numberOfReviews} review{entry.numberOfReviews !== 1 ? "s" : ""})</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          {entry.applicant?.skills && entry.applicant.skills.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {entry.applicant.skills.map((s) => (
                  <Badge key={s.id} variant="secondary">{s.name}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {entry.applicant?.certifications && entry.applicant.certifications.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Certifications</p>
              <div className="flex flex-wrap gap-1.5">
                {entry.applicant.certifications.map((c, i) => (
                  <Badge key={i} variant="outline">{c.name}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Proposal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="size-4" /> Proposal
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {entry.message && (
            <p className="text-sm text-muted-foreground leading-relaxed">{entry.message}</p>
          )}
          <Separator />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            {entry.bid > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Proposed Price</span>
                <span className="font-semibold flex items-center gap-1">
                  <DollarSign className="size-3.5 text-muted-foreground" />
                  ${Number(entry.bid).toLocaleString()} CAD
                </span>
              </div>
            )}
            {entry.estimatedDelivery && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Est. Completion</span>
                <span className="font-medium flex items-center gap-1">
                  <CalendarDays className="size-3.5 text-muted-foreground" />
                  {new Date(entry.estimatedDelivery).toLocaleDateString("en-CA", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Availability</span>
              <span className="font-medium flex items-center gap-1">
                <Clock className="size-3.5 text-muted-foreground" />
                {entry.availability === "now"
                  ? "Available now"
                  : new Date(entry.availability).toLocaleDateString("en-CA", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <ApplicantActions
        entryId={entry.id}
        requestId={Number(id)}
        serviceRequestId={entry.serviceRequest.id}
        expertBid={entry.bid}
        originalBudget={entry.serviceRequest.budget}
        budgetOption={entry.serviceRequest.budgetOption}
        expertName={name}
        expertAvatar={entry.applicant?.avatarUrl ?? ""}
        requestTitle={entry.serviceRequest.issue}
        status={entry.status}
      />
    </div>
  )
}
