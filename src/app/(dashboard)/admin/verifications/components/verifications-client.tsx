"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
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
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"

type VerificationItem = {
  id: string
  name: string
  email: string
  avatarUrl: string
  status: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED"
  timeAgo: string
  jobTitle: string
}

type Props = {
  initialItems: VerificationItem[]
  totalElements: number
}

export function VerificationsClient({ initialItems, totalElements }: Props) {
  const { t } = useTranslation()
  const [items, setItems] = useState(initialItems)
  const [rejectTarget, setRejectTarget] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [loading, setLoading] = useState<string | null>(null)

  async function handleApprove(id: string) {
    setLoading(id)
    try {
      const res = await fetch(`/api/admin/verifications/${id}/approve`, { method: "POST" })
      if (!res.ok) throw new Error()
      setItems(prev => prev.map(v => v.id === id ? { ...v, status: "APPROVED" } : v))
      toast.success(t("admin.verifications.approved"))
    } catch {
      toast.error(t("admin.verifications.approveFailed"))
    } finally {
      setLoading(null)
    }
  }

  async function handleReject() {
    if (!rejectTarget || !rejectReason.trim()) return
    setLoading(rejectTarget)
    try {
      const res = await fetch(`/api/admin/verifications/${rejectTarget}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      })
      if (!res.ok) throw new Error()
      setItems(prev => prev.map(v => v.id === rejectTarget ? { ...v, status: "REJECTED" } : v))
      toast.success(t("admin.verifications.rejected"))
    } catch {
      toast.error(t("admin.verifications.rejectFailed"))
    } finally {
      setLoading(null)
      setRejectTarget(null)
      setRejectReason("")
    }
  }

  const pending = items.filter(v => v.status === "PENDING" || v.status === "REVIEWING")
  const reviewed = items.filter(v => v.status === "APPROVED" || v.status === "REJECTED")

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("admin.verifications.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("admin.verifications.totalSubmissions", { n: totalElements })}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("admin.verifications.pendingReview")}</CardTitle>
          <CardDescription>{t("admin.verifications.pendingCount", { n: pending.length })}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground px-6 py-8 text-center">{t("admin.verifications.noPending")}</p>
          ) : (
            <div className="divide-y">
              {pending.map(item => (
                <VerificationRow
                  key={item.id}
                  item={item}
                  loading={loading === item.id}
                  onApprove={() => handleApprove(item.id)}
                  onReject={() => { setRejectTarget(item.id); setRejectReason("") }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {reviewed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("admin.verifications.reviewed")}</CardTitle>
            <CardDescription>{t("admin.verifications.reviewedCount", { n: reviewed.length })}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {reviewed.map(item => (
                <VerificationRow
                  key={item.id}
                  item={item}
                  loading={false}
                  readOnly
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!rejectTarget} onOpenChange={open => !open && setRejectTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.verifications.rejectTitle")}</DialogTitle>
            <DialogDescription>
              {t("admin.verifications.rejectDescription")}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder={t("admin.verifications.rejectReason")}
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>{t("common.cancel")}</Button>
            <Button
              variant="destructive"
              disabled={!rejectReason.trim() || loading === rejectTarget}
              onClick={handleReject}
            >
              {t("admin.verifications.reject")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function VerificationRow({
  item,
  loading,
  readOnly = false,
  onApprove,
  onReject,
}: {
  item: VerificationItem
  loading: boolean
  readOnly?: boolean
  onApprove?: () => void
  onReject?: () => void
}) {
  const { t } = useTranslation()
  const statusBadge: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    PENDING:   { label: t("admin.verifications.statusPending"),   variant: "secondary" },
    REVIEWING: { label: t("admin.verifications.statusReviewing"), variant: "default" },
    APPROVED:  { label: t("admin.verifications.statusApproved"),  variant: "outline" },
    REJECTED:  { label: t("admin.verifications.statusRejected"),  variant: "destructive" },
  }
  const badge = statusBadge[item.status] ?? { label: item.status, variant: "outline" as const }

  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <Avatar className="size-9 shrink-0">
        <AvatarImage src={item.avatarUrl} alt={item.name} />
        <AvatarFallback>{item.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{item.name}</p>
        <p className="text-xs text-muted-foreground truncate">{item.email}</p>
        {item.jobTitle && (
          <p className="text-xs text-muted-foreground">{item.jobTitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-muted-foreground hidden sm:block">{item.timeAgo}</span>
        <Badge variant={badge.variant}>{badge.label}</Badge>
        {!readOnly && (
          <>
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50"
              disabled={loading}
              onClick={onApprove}
            >
              <CheckCircle2 className="size-3.5 mr-1" />
              {t("admin.verifications.approve")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive border-destructive/20 hover:bg-destructive/5"
              disabled={loading}
              onClick={onReject}
            >
              <XCircle className="size-3.5 mr-1" />
              {t("admin.verifications.reject")}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
