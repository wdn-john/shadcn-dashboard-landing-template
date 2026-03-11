import Link from "next/link"
import { serverGet } from "@/lib/server/api"
import { getSession } from "@/lib/server/getSession"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Plus, ClipboardList, ArrowRight, Clock, CheckCircle, Circle, Loader } from "lucide-react"
import { T } from "@/components/t"

type ServiceRequest = {
  id: number
  issue: string
  description: string
  budget: number
  budgetOption: string
  category: string
  priority: string
  status: string
  workLocation: string
  createdAt: string
  desiredCompletionDate: string | null
  applications: unknown[]
}

type PaginatedResponse = {
  content: ServiceRequest[]
  totalElements: number
}

function statusConfig(status: string) {
  switch (status) {
    case "Open":
      return { variant: "default" as const, icon: Circle }
    case "In Progress":
      return { variant: "secondary" as const, icon: Loader }
    case "Completed":
      return { variant: "outline" as const, icon: CheckCircle }
    case "Pending":
      return { variant: "outline" as const, icon: Clock }
    default:
      return { variant: "outline" as const, icon: Circle }
  }
}

function priorityVariant(priority: string) {
  switch (priority) {
    case "High": return "destructive" as const
    case "Medium": return "secondary" as const
    default: return "outline" as const
  }
}

export default async function RequestsPage() {
  const session = await getSession()
  if (!session.isAuthenticated) redirect("/auth/sign-in")

  const data = await serverGet<PaginatedResponse>("/service-requests/current-user?page=0&size=20")
  const requests = data?.content ?? []
  const total = data?.totalElements ?? 0

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight"><T k="requests.title" /></h1>
          <p className="text-muted-foreground mt-1">
            {total > 0 ? <T k="requests.subtitle" values={{ count: total }} /> : <T k="requests.noRequests" />}
          </p>
        </div>
        <Button asChild>
          <Link href="/requests/new">
            <Plus className="size-4" />
            <T k="requests.postRequest" />
          </Link>
        </Button>
      </div>

      {/* Content */}
      {requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <ClipboardList className="size-12 text-muted-foreground/40" />
            <div>
              <p className="font-semibold text-lg"><T k="requests.noRequests" /></p>
              <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                <T k="requests.noRequestsHint" />
              </p>
            </div>
            <Button asChild>
              <Link href="/requests/new">
                <Plus className="size-4" />
                <T k="requests.postRequest" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => {
            const sc = statusConfig(req.status)
            const StatusIcon = sc.icon
            const applicantCount = Array.isArray(req.applications) ? req.applications.length : 0

            return (
              <Card key={req.id} className="hover:shadow-sm transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base font-semibold truncate">
                        {req.issue || req.description}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {req.description}
                      </CardDescription>
                    </div>
                    <Badge variant={sc.variant} className="shrink-0 flex items-center gap-1">
                      <StatusIcon className="size-3" />
                      {req.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    {req.category && (
                      <span className="font-medium text-foreground">{req.category}</span>
                    )}
                    {req.priority && (
                      <Badge variant={priorityVariant(req.priority)} className="text-xs">
                        {req.priority}
                      </Badge>
                    )}
                    {req.workLocation && <span>{req.workLocation}</span>}
                    {req.budget != null && (
                      <span>${Number(req.budget).toLocaleString()}</span>
                    )}
                    {applicantCount > 0 && (
                      <span>
                        <T k={applicantCount === 1 ? "requests.applicant" : "requests.applicants_count"} values={{ n: applicantCount }} />
                      </span>
                    )}
                    <span className="ml-auto">
                      {req.createdAt
                        ? new Date(req.createdAt).toLocaleDateString("en-CA", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/requests/${req.id}`} className="flex items-center gap-1">
                        <T k="common.view" /> <ArrowRight className="size-3" />
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
