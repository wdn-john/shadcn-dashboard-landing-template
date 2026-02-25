import { notFound } from "next/navigation"
import { serverGet } from "@/lib/server/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  CalendarDays,
  User,
} from "lucide-react"
import { MissionTracker } from "./components/mission-tracker"
import type { MissionDetailsDTO } from "@/types/MissionDetailsDTO"
import type { MissionProgressDTO } from "@/types/MissionProgress"

function priorityVariant(p: string) {
  switch (p) {
    case "HIGH":   return "destructive" as const
    case "MEDIUM": return "secondary" as const
    default:       return "outline" as const
  }
}

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [details, progress] = await Promise.all([
    serverGet<MissionDetailsDTO>(`/missions/${id}/details`),
    serverGet<MissionProgressDTO>(`/missions/${id}/progress`).catch(() => null),
  ])

  if (!details) notFound()

  const clientInitials = details.clientName
    ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?"

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-3xl">
      {/* Back */}
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link href="/missions" className="flex items-center gap-1 text-muted-foreground">
            <ArrowLeft className="size-3" /> My Missions
          </Link>
        </Button>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h1 className="text-2xl font-bold tracking-tight">{details.title}</h1>
          <div className="flex gap-2 flex-wrap">
            <Badge variant={priorityVariant(details.priority)}>{details.priority}</Badge>
            <Badge variant="outline">{details.workLocation.replace("_", " ")}</Badge>
          </div>
        </div>
      </div>

      {/* Mission info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mission Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{details.description}</p>
          <Separator />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Final Price</span>
              <span className="font-semibold flex items-center gap-1">
                <DollarSign className="size-3.5 text-muted-foreground" />
                ${Number(details.finalQuotedPrice).toLocaleString("en-CA", { minimumFractionDigits: 2 })} CAD
              </span>
            </div>
            {details.desiredCompletionDate && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Due Date</span>
                <span className="font-medium flex items-center gap-1">
                  <CalendarDays className="size-3.5 text-muted-foreground" />
                  {new Date(details.desiredCompletionDate).toLocaleDateString("en-CA", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </span>
              </div>
            )}
            {details.revisionCount > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Revisions</span>
                <span className="font-medium">{details.revisionCount}</span>
              </div>
            )}
            {details.address?.city && (
              <div className="flex flex-col gap-1 col-span-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Location</span>
                <span className="font-medium flex items-center gap-1">
                  <MapPin className="size-3.5 text-muted-foreground" />
                  {[details.address.city, details.address.region].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
          </div>

          <Separator />

          {/* Client info */}
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={details.clientAvatarUrl ?? undefined} alt={details.clientName} />
              <AvatarFallback>{clientInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Client</p>
              <p className="font-medium text-sm">{details.clientName}</p>
              {details.clientTitle && (
                <p className="text-xs text-muted-foreground">{details.clientTitle}</p>
              )}
            </div>
            <User className="size-4 text-muted-foreground ml-auto" />
          </div>
        </CardContent>
      </Card>

      {/* Step tracker */}
      <MissionTracker
        missionId={Number(id)}
        missionEntityId={details.id}
        initialProgress={progress}
        allStepsCompleted={details.allMissionStepsCompleted}
        clientName={details.clientName}
      />
    </div>
  )
}
