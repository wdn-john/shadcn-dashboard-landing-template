import Link from "next/link"
import { serverGet } from "@/lib/server/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowRight, MapPin, Calendar, Search } from "lucide-react"
import { RequestFilters } from "./components/request-filters"

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
}

type PaginatedResponse = {
  content: ServiceRequest[]
  totalElements: number
  totalPages: number
}

function priorityVariant(p: string) {
  switch (p) {
    case "High": return "destructive" as const
    case "Medium": return "secondary" as const
    default: return "outline" as const
  }
}

function categoryColor(cat: string) {
  const map: Record<string, string> = {
    Software: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    Hardware: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    Network: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    Security: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    Project: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    Other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  }
  return map[cat] ?? map.Other
}

export default async function BrowseRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; priority?: string; workLocation?: string }>
}) {
  const sp = await searchParams
  const page = Math.max(0, Number(sp.page ?? 0) - 1)

  const params = new URLSearchParams({
    page: String(page),
    size: "12",
    sort: "createdAt,desc",
  })
  if (sp.category) params.set("category", sp.category)
  if (sp.priority) params.set("priority", sp.priority)
  if (sp.workLocation) params.set("workLocation", sp.workLocation)

  const data = await serverGet<PaginatedResponse>(`/service-requests?${params}`)
  const requests = data?.content ?? []
  const total = data?.totalElements ?? 0
  const totalPages = data?.totalPages ?? 1
  const currentPage = page + 1

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Browse Requests</h1>
        <p className="text-muted-foreground mt-1">
          {total > 0 ? `${total} open request${total !== 1 ? "s" : ""}` : "No requests available"}
        </p>
      </div>

      {/* Filters */}
      <RequestFilters />

      {/* Grid */}
      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <Search className="size-12 text-muted-foreground/40" />
          <p className="font-semibold">No requests found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters, or check back later for new requests.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {requests.map((req) => {
              const applicantCount = Array.isArray(req.applications) ? req.applications.length : 0
              return (
                <Card key={req.id} className="flex flex-col hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColor(req.category)}`}
                      >
                        {req.category}
                      </span>
                      <Badge variant={priorityVariant(req.priority)} className="text-xs shrink-0">
                        {req.priority}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-semibold leading-snug line-clamp-2 mt-2">
                      {req.issue || req.description}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 pb-2">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {req.description}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {req.workLocation}
                      </span>
                      {req.budget != null ? (
                        <span className="font-semibold text-foreground">
                          ${Number(req.budget).toLocaleString()} ({req.budgetOption})
                        </span>
                      ) : (
                        <span>{req.budgetOption}</span>
                      )}
                      {applicantCount > 0 && (
                        <span>{applicantCount} applicant{applicantCount !== 1 ? "s" : ""}</span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between pt-3 border-t">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="size-3" />
                      {req.createdAt
                        ? new Date(req.createdAt).toLocaleDateString("en-CA", {
                            month: "short", day: "numeric",
                          })
                        : ""}
                    </span>
                    <Button size="sm" asChild>
                      <Link href={`/browse-requests/${req.id}`} className="flex items-center gap-1">
                        View <ArrowRight className="size-3" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pb-4">
              {currentPage > 1 && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`?${new URLSearchParams({ ...sp, page: String(currentPage - 1) })}`}>
                    Previous
                  </Link>
                </Button>
              )}
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`?${new URLSearchParams({ ...sp, page: String(currentPage + 1) })}`}>
                    Next
                  </Link>
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
