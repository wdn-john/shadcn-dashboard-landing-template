"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Calendar, RefreshCw, DollarSign, Clock, Trash2 } from "lucide-react"
import { formatDistanceToNow, format, parseISO } from "date-fns"
import { toast } from "sonner"
import type { EntryDetails } from "../page"

type Props = {
  details: EntryDetails
  entryId: number
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  PENDING:    { label: "Pending",   variant: "secondary" },
  REVIEWING:  { label: "Reviewing", variant: "default" },
  ACCEPTED:   { label: "Accepted",  variant: "outline" },
  REJECTED:   { label: "Rejected",  variant: "destructive" },
  WITHDRAWN:  { label: "Withdrawn", variant: "secondary" },
  CHOSEN:     { label: "Chosen",    variant: "outline" },
}

function fmtDate(d: string) {
  try { return format(parseISO(d), "MMM d, yyyy") } catch { return d }
}

function fmtAgo(d: string) {
  try { return formatDistanceToNow(parseISO(d), { addSuffix: true }) } catch { return d }
}

export function ApplicationDetail({ details, entryId }: Props) {
  const router = useRouter()
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)

  const statusCfg = statusMap[details.status?.toUpperCase()] ?? { label: details.status, variant: "secondary" as const }
  const canWithdraw = details.status?.toUpperCase() === "PENDING" || details.status?.toUpperCase() === "REVIEWING"

  async function handleWithdraw() {
    setWithdrawing(true)
    try {
      const res = await fetch(`/api/applications/entries/${entryId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Application withdrawn")
      router.push("/applications")
    } catch {
      toast.error("Failed to withdraw application")
    } finally {
      setWithdrawing(false)
      setWithdrawOpen(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="-ml-2">
          <Link href="/applications"><ArrowLeft className="size-4" /></Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight truncate">{details.title}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{details.category}</p>
        </div>
        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column — proposal details */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Proposal</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <DollarSign className="size-3" /> Proposed Price
                  </p>
                  <p className="font-semibold text-sm">
                    {details.proposedPrice != null ? `$${details.proposedPrice.toLocaleString()}` : "—"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3" /> Delivery
                  </p>
                  <p className="font-semibold text-sm">
                    {details.estimatedDelivery ? fmtDate(details.estimatedDelivery) : "—"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <RefreshCw className="size-3" /> Revisions
                  </p>
                  <p className="font-semibold text-sm">{details.revisions ?? 0}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3" /> Availability
                  </p>
                  <p className="font-semibold text-sm capitalize">
                    {details.availability === "now" ? "Immediately" : details.availability ? fmtDate(details.availability) : "—"}
                  </p>
                </div>
              </div>

              {details.message && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Cover Letter</p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{details.message}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          {details.timeline?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="relative border-l border-border ml-2 flex flex-col gap-6">
                  {details.timeline.map((event, i) => (
                    <li key={i} className="ml-6">
                      <span
                        className="absolute -left-[7px] flex size-3.5 items-center justify-center rounded-full ring-2 ring-background"
                        style={{ backgroundColor: event.color ?? "currentColor" }}
                      />
                      <p className="text-sm font-medium">{event.label}</p>
                      {event.createdAt && (
                        <p className="text-xs text-muted-foreground mt-0.5">{fmtAgo(event.createdAt)}</p>
                      )}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column — request info + actions */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Request</CardTitle>
              <CardDescription>{details.category}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarImage src={details.requestOwner?.avatar} alt={details.requestOwner?.name} />
                  <AvatarFallback>{details.requestOwner?.firstName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{details.requestOwner?.name ?? "—"}</p>
                  {details.requestOwner?.subtitle && (
                    <p className="text-xs text-muted-foreground truncate">{details.requestOwner.subtitle}</p>
                  )}
                </div>
              </div>
              {details.budget != null && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-medium">${details.budget.toLocaleString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {canWithdraw && (
            <Button
              variant="outline"
              className="text-destructive border-destructive/20 hover:bg-destructive/5"
              onClick={() => setWithdrawOpen(true)}
            >
              <Trash2 className="size-4 mr-2" />
              Withdraw Application
            </Button>
          )}
        </div>
      </div>

      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to withdraw your application for <strong>{details.title}</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawOpen(false)}>Cancel</Button>
            <Button variant="destructive" disabled={withdrawing} onClick={handleWithdraw}>
              Withdraw
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
