import { notFound } from "next/navigation"
import { serverGet } from "@/lib/server/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import {
  ArrowLeft,
  Star,
  CalendarDays,
  Clock,
  DollarSign,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Briefcase,
} from "lucide-react"
import { ApplicantActions } from "./components/applicant-actions"
import { T } from "@/components/t"

type Experience = {
  id?: number
  title: string
  company: string
  location?: string
  description?: string
  startDate: string
  endDate?: string
  current: boolean
}

type Review = {
  id: number
  rating: number
  comment: string
  tags: { tagName: string }[] | null
  reviewer: {
    fullName: string
    avatarUrl: string | null
  }
  createdAt: string
  serviceRequestIssue: string | null
}

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
    experiences?: Experience[]
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

type ReviewsResponse = {
  content: Review[]
  totalElements: number
}

function fmtDate(d: string | undefined) {
  if (!d) return ""
  try { return format(parseISO(d), "MMM yyyy") } catch { return d }
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

  const reviewsData = entry.applicant?.id
    ? await serverGet<ReviewsResponse>(`/reviews/profile/${entry.applicant.id}?page=0&size=5`)
    : null
  const reviews = reviewsData?.content ?? []

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-3xl">
      {/* Back */}
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link href={`/requests/${id}`} className="flex items-center gap-1 text-muted-foreground">
            <ArrowLeft className="size-3" /> <T k="applicantDetail.backToApplicants" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight"><T k="applicantDetail.pageTitle" /></h1>
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
                    <ShieldCheck className="size-3" /> <T k="applicantDetail.verified" />
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
                    <span className="text-muted-foreground">
                      ({entry.numberOfReviews}{" "}
                      <T k={entry.numberOfReviews === 1 ? "applicantDetail.review" : "applicantDetail.reviews"} />)
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          {entry.applicant?.skills && entry.applicant.skills.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                <T k="applicantDetail.skillsLabel" />
              </p>
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
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                <T k="applicantDetail.certsLabel" />
              </p>
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
            <MessageSquare className="size-4" /> <T k="applicantDetail.proposalTitle" />
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
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  <T k="applicantDetail.proposedPrice" />
                </span>
                <span className="font-semibold flex items-center gap-1">
                  <DollarSign className="size-3.5 text-muted-foreground" />
                  ${Number(entry.bid).toLocaleString()} CAD
                </span>
              </div>
            )}
            {entry.estimatedDelivery && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  <T k="applicantDetail.estCompletion" />
                </span>
                <span className="font-medium flex items-center gap-1">
                  <CalendarDays className="size-3.5 text-muted-foreground" />
                  {new Date(entry.estimatedDelivery).toLocaleDateString("en-CA", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                <T k="applicantDetail.availability" />
              </span>
              <span className="font-medium flex items-center gap-1">
                <Clock className="size-3.5 text-muted-foreground" />
                {entry.availability === "now"
                  ? <T k="applicantDetail.availableNow" />
                  : new Date(entry.availability).toLocaleDateString("en-CA", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience */}
      {entry.applicant?.experiences && entry.applicant.experiences.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base"><T k="applicantDetail.experienceTitle" /></CardTitle>
            <CardDescription>
              {entry.applicant.experiences.length}{" "}
              <T k={entry.applicant.experiences.length === 1 ? "applicantDetail.experienceEntry" : "applicantDetail.experienceEntries"} />
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            {entry.applicant.experiences.map((exp, i) => (
              <div key={exp.id ?? i}>
                {i > 0 && <Separator />}
                <div className="flex gap-4 px-5 py-4">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted shrink-0 mt-0.5">
                    <Briefcase className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{exp.title}</p>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                    {exp.location && (
                      <p className="text-xs text-muted-foreground">{exp.location}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {fmtDate(exp.startDate)} – {exp.current ? <T k="applicantDetail.present" /> : fmtDate(exp.endDate)}
                    </p>
                    {exp.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{exp.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base"><T k="applicantDetail.reviewsTitle" /></CardTitle>
            <CardDescription>
              {entry.averageRating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  {entry.averageRating.toFixed(1)} ·{" "}
                  {entry.numberOfReviews}{" "}
                  <T k={entry.numberOfReviews === 1 ? "applicantDetail.review" : "applicantDetail.reviews"} />
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            {reviews.map((review, i) => (
              <div key={review.id}>
                {i > 0 && <Separator />}
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="size-7 shrink-0">
                        <AvatarImage src={review.reviewer?.avatarUrl ?? undefined} />
                        <AvatarFallback className="text-xs">
                          {(review.reviewer?.fullName ?? "?").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {review.reviewer?.fullName ?? <T k="applicantDetail.anonymous" />}
                        </p>
                        {review.serviceRequestIssue && (
                          <p className="text-xs text-muted-foreground truncate">{review.serviceRequestIssue}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star
                          key={si}
                          className={`size-3 ${si < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{review.comment}</p>
                  )}
                  {review.tags && review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {review.tags.map((tag, ti) => (
                        <Badge key={ti} variant="secondary" className="text-xs">{tag.tagName}</Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(review.createdAt).toLocaleDateString("en-CA", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

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
