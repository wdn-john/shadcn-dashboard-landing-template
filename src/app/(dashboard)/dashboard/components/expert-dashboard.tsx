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
import { Search, Send, Briefcase, ArrowRight, MapPin } from "lucide-react"

type AvailableRequest = {
  id: number
  issue: string
  description: string
  category: string
  priority: string
  budget: number
  workLocation: string
  status: string
  createdAt: string
}

type Props = {
  firstName?: string
  availableRequests: AvailableRequest[]
  totalAvailable: number
}

function priorityVariant(priority: string): "default" | "secondary" | "destructive" | "outline" {
  switch (priority?.toLowerCase()) {
    case "high": return "destructive"
    case "medium": return "secondary"
    case "low": return "outline"
    default: return "outline"
  }
}

export function ExpertDashboard({ firstName, availableRequests, totalAvailable }: Props) {
  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {firstName ? `Welcome back, ${firstName}` : "Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse available IT requests and manage your active missions.
          </p>
        </div>
        <Button asChild>
          <Link href="/browse-requests">
            <Search className="size-4" />
            Browse Requests
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Available Requests</CardDescription>
            <Search className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{totalAvailable}</p>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Open requests you can apply to
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>My Applications</CardDescription>
            <Send className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">—</p>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Submitted applications pending review
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Active Missions</CardDescription>
            <Briefcase className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">—</p>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Missions currently in progress
          </CardFooter>
        </Card>
      </div>

      {/* Recent available requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Requests</CardTitle>
            <CardDescription>Latest IT service requests from clients</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/browse-requests" className="flex items-center gap-1">
              Browse all <ArrowRight className="size-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {availableRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <Search className="size-10 text-muted-foreground/50" />
              <p className="text-muted-foreground font-medium">No requests available</p>
              <p className="text-sm text-muted-foreground">
                New requests will appear here as clients post them.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {availableRequests.map((req) => (
                <div key={req.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{req.issue || req.description}</p>
                      <Badge variant={priorityVariant(req.priority)} className="shrink-0 text-xs">
                        {req.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {req.category && <span>{req.category}</span>}
                      {req.workLocation && (
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {req.workLocation}
                        </span>
                      )}
                      {req.budget != null && (
                        <span className="font-medium text-foreground">
                          ${Number(req.budget).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild className="shrink-0">
                    <Link href={`/browse-requests/${req.id}`}>Apply</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
