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
            {firstName ? `Welcome back, ${firstName}` : "Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your IT service requests and track mission progress.
          </p>
        </div>
        <Button asChild>
          <Link href="/requests/new">
            <Plus className="size-4" />
            Post a Request
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>My Requests</CardDescription>
            <ClipboardList className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{total}</p>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            {open} open · {inProgress} in progress · {completed} completed
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Pending Applications</CardDescription>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">—</p>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Experts waiting for your review
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Active Missions</CardDescription>
            <Briefcase className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{inProgress}</p>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Work currently in progress
          </CardFooter>
        </Card>
      </div>

      {/* Recent requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Service Requests</CardTitle>
            <CardDescription>Your posted IT requests and their current status</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/requests" className="flex items-center gap-1">
              View all <ArrowRight className="size-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <ClipboardList className="size-10 text-muted-foreground/50" />
              <p className="text-muted-foreground font-medium">No requests yet</p>
              <p className="text-sm text-muted-foreground">
                Post your first IT service request to get started.
              </p>
              <Button asChild size="sm">
                <Link href="/requests/new">
                  <Plus className="size-4" />
                  Post a Request
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
                      {req.price != null ? `$${Number(req.price).toFixed(2)}` : "No budget set"}
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
                      <Link href={`/requests/${req.id}`}>View</Link>
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
