"use client"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { CreditCard } from "lucide-react"

export type PaymentItem = {
  id: string
  title: string
  expertName: string
  amount: number
  status: "COMPLETED" | "PENDING" | "REFUNDED" | "PRE_AUTHORIZED"
  paidAt?: string
}

const STATUS_LABELS: Record<PaymentItem["status"], string> = {
  COMPLETED: "Paid",
  PENDING: "Pending",
  REFUNDED: "Refunded",
  PRE_AUTHORIZED: "Pre-Auth",
}

const STATUS_VARIANTS: Record<PaymentItem["status"], "default" | "secondary" | "destructive" | "outline"> = {
  COMPLETED: "default",
  PENDING: "secondary",
  REFUNDED: "destructive",
  PRE_AUTHORIZED: "outline",
}

interface Props {
  payments: PaymentItem[]
  loading: boolean
  hasMore: boolean
  onLoadMore: () => void
  loadingMore: boolean
}

export function PaymentsList({ payments, loading, hasMore, onLoadMore, loadingMore }: Props) {
  if (loading && payments.length === 0) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    )
  }

  if (!loading && payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center text-muted-foreground">
        <CreditCard className="h-8 w-8 opacity-40" />
        <p className="text-sm">No payment history found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/30 transition-colors"
        >
          <div className="min-w-0">
            <p className="truncate font-medium text-sm">{payment.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {payment.expertName}
              {payment.paidAt && (
                <> · {format(new Date(payment.paidAt), "MMM d, yyyy")}</>
              )}
            </p>
          </div>

          <div className="ml-4 flex items-center gap-3 shrink-0">
            <Badge variant={STATUS_VARIANTS[payment.status]} className="text-xs">
              {STATUS_LABELS[payment.status]}
            </Badge>
            <span className="font-semibold text-sm">${payment.amount.toFixed(2)}</span>
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" onClick={onLoadMore} disabled={loadingMore}>
            {loadingMore ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </div>
  )
}
