"use client"

import { useEffect, useState, useCallback } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentsSummaryCard, type PaymentSummary } from "./components/payments-summary-card"
import { PaymentsList, type PaymentItem } from "./components/payments-list"

type Category = "ALL" | "CURRENT_MONTH" | "CURRENT_WEEK"

const TAB_LABELS: { value: Category; label: string }[] = [
  { value: "ALL", label: "All Time" },
  { value: "CURRENT_MONTH", label: "This Month" },
  { value: "CURRENT_WEEK", label: "This Week" },
]

export default function PaymentsPage() {
  const [summary, setSummary] = useState<PaymentSummary | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(true)

  const [category, setCategory] = useState<Category>("ALL")
  const [payments, setPayments] = useState<PaymentItem[]>([])
  const [page, setPage] = useState(0)
  const [isLast, setIsLast] = useState(false)
  const [paymentsLoading, setPaymentsLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const loadPayments = useCallback(async (cat: Category, pg: number, append: boolean) => {
    if (pg === 0) setPaymentsLoading(true)
    else setLoadingMore(true)
    try {
      const res = await fetch(`/api/payments?page=${pg}&category=${cat}`)
      const json = await res.json()
      if (json.ok) {
        const data = json.data as {
          content: PaymentItem[]
          last: boolean
          summary?: PaymentSummary
        }
        setPayments((prev) => (append ? [...prev, ...data.content] : data.content))
        setIsLast(data.last)
        setPage(pg)
        // If backend returns summary inline on first page load
        if (!append && data.summary) {
          setSummary(data.summary)
          setSummaryLoading(false)
        }
      }
    } finally {
      setPaymentsLoading(false)
      setLoadingMore(false)
    }
  }, [])

  // Compute summary from loaded data if backend doesn't provide it separately
  useEffect(() => {
    setSummaryLoading(true)
    const computeSummary = () => {
      if (payments.length === 0) {
        setSummary({ totalSpent: 0, totalJobs: 0, pendingAmount: 0 })
        setSummaryLoading(false)
        return
      }
      const totalSpent = payments
        .filter((p) => p.status === "COMPLETED")
        .reduce((acc, p) => acc + p.amount, 0)
      const pendingAmount = payments
        .filter((p) => p.status === "PENDING" || p.status === "PRE_AUTHORIZED")
        .reduce((acc, p) => acc + p.amount, 0)
      const totalJobs = payments.filter((p) => p.status === "COMPLETED").length
      setSummary({ totalSpent, totalJobs, pendingAmount })
      setSummaryLoading(false)
    }
    if (!paymentsLoading) computeSummary()
  }, [payments, paymentsLoading])

  useEffect(() => {
    void loadPayments(category, 0, false)
  }, [category, loadPayments])

  const handleTabChange = (value: string) => {
    setCategory(value as Category)
    setPage(0)
    setPayments([])
  }

  return (
    <div className="px-4 md:px-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-muted-foreground text-sm mt-1">View your payment history and transactions.</p>
      </div>

      <PaymentsSummaryCard summary={summary} loading={summaryLoading} />

      <div className="space-y-4">
        <Tabs value={category} onValueChange={handleTabChange}>
          <TabsList>
            {TAB_LABELS.map(({ value, label }) => (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <PaymentsList
          payments={payments}
          loading={paymentsLoading}
          hasMore={!isLast}
          onLoadMore={() => void loadPayments(category, page + 1, true)}
          loadingMore={loadingMore}
        />
      </div>
    </div>
  )
}
