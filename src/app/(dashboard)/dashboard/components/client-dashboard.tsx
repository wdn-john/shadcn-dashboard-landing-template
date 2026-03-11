import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardList, Users, Briefcase, Plus, ArrowRight } from "lucide-react"
import { T } from "@/components/t"

type RequestSummary = {
  id: number
  title: string
  description: string
  posted: string
  price: number
  status: string
}

type Props = {
  firstName?: string
  requests: RequestSummary[]
}

function statusVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "Open": return "default"
    case "In Progress": return "secondary"
    case "Completed": return "outline"
    default: return "outline"
  }
}

export function ClientDashboard({ firstName, requests }: Props) {
  const total = requests.length
  const open = requests.filter((r) => r.status === "Open").length
  const inProgress = requests.filter((r) => r.status === "In Progress").length
  const completed = requests.filter((r) => r.status === "Completed").length

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {firstName
              ? <T k="dashboard.welcome" values={{ name: firstName }} />
              : <T k="dashboard.title" />}
          </h1>
          <p className="text-muted-foreground mt-1">
            <T k="dashboard.client.subtitle" />
          </p>
        </div>
        <Button asChild>
          <Link href="/requests/new">
            <Plus className="size-4" />
            <T k="dashboard.client.postRequest" />
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription><T k="dashboard.client.myRequests" /></CardDescription>
            <ClipboardList className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{total}</p>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            <T k="dashboard.client.openStatus" values={{ open, inProgress, completed }} />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription><T k="dashboard.client.pendingApplications" /></CardDescription>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">—</p>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            <T k="dashboard.client.expertsReview" />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription><T k="dashboard.client.activeMissions" /></CardDescription>
            <Briefcase className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{inProgress}</p>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            <T k="dashboard.client.workInProgress" />
          </CardFooter>
        </Card>
      </div>

      {/* Recent requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle><T k="dashboard.client.myServiceRequests" /></CardTitle>
            <CardDescription><T k="dashboard.client.requestsDesc" /></CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/requests" className="flex items-center gap-1">
              <T k="dashboard.client.viewAll" /> <ArrowRight className="size-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <ClipboardList className="size-10 text-muted-foreground/50" />
              <p className="text-muted-foreground font-medium"><T k="dashboard.client.noRequests" /></p>
              <p className="text-sm text-muted-foreground">
                <T k="dashboard.client.noRequestsHint" />
              </p>
              <Button asChild size="sm">
                <Link href="/requests/new">
                  <Plus className="size-4" />
                  <T k="dashboard.client.postRequest" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {requests.map((req) => (
                <div key={req.id} className="flex items-center justify-between py-3 gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{req.title || req.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {req.price != null ? `$${Number(req.price).toFixed(2)}` : <T k="dashboard.client.noBudget" />}
                      {" · "}
                      {req.posted
                        ? new Date(req.posted).toLocaleDateString("en-CA", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={statusVariant(req.status)}>{req.status}</Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/requests/${req.id}`}><T k="common.view" /></Link>
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
