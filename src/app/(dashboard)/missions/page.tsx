import { serverGet } from "@/lib/server/api"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Briefcase, ChevronRight } from "lucide-react"

type MissionListItem = {
  id: number
  title: string
  progress: number
  clientName: string
  status: "In Progress" | "Completed" | "Pending" | "Cancelled"
}

type PaginatedMissions = {
  content: MissionListItem[]
  totalElements: number
  totalPages: number
  last: boolean
}

function statusVariant(s: string) {
  switch (s) {
    case "In Progress": return "secondary" as const
    case "Completed":   return "default" as const
    case "Pending":     return "outline" as const
    case "Cancelled":   return "destructive" as const
    default:            return "outline" as const
  }
}

export default async function MissionsPage() {
  const res = await serverGet<PaginatedMissions>("/missions/current-user?page=0")
  const missions = res?.content ?? []

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Missions</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track and manage your active missions.
        </p>
      </div>

      {missions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <Briefcase className="size-12 text-muted-foreground/30" />
          <p className="font-medium">No missions yet</p>
          <p className="text-sm text-muted-foreground">
            Once a client selects you and completes checkout, your mission will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {missions.map((m) => (
            <Link key={m.id} href={`/missions/${m.id}`}>
              <Card className="hover:bg-muted/40 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-sm truncate">{m.title}</p>
                      <Badge variant={statusVariant(m.status)} className="text-xs shrink-0">
                        {m.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Client: {m.clientName}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={m.progress} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground shrink-0">{m.progress}%</span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
