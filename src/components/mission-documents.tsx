"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, TrendingUp, Download, ExternalLink, Loader2, ChevronLeft } from "lucide-react"

// ── Types ───────────────────────────────────────────────────────────────────

type ClientReceipt = {
  id: number
  receiptNumber: string
  requestName: string
  formattedReceiptDate: string
  formattedServicePrice: string
  formattedPlatformFee: string
  formattedCheckoutTps: string
  formattedCheckoutTvq: string
  formattedCheckoutTotal: string
  formattedRemainingAmount: string
  expertName: string
  expertEmail: string
  expertPhoneNumber?: string
  expertTpsNumber?: string
  expertTvqNumber?: string
  clientName: string
  clientEmail: string
  clientPhoneNumber?: string
  paymentMethod: string
  paymentMethodLastFourDigits: string
  paymentIntentId: string
  pdfDownloadUrl?: string
  createdAt: string
}

type EarningsReport = {
  id: number
  earningsReportNumber: string
  formattedCreatedAt: string
  formattedAmount: string
  formattedExpertTps: string
  formattedExpertTvq: string
  formattedExpertBruteAmount: string
  formattedExpertPayoutAmount: string
  formattedPlatformFee: string
  formattedPlatformTps: string
  formattedPlatformTvq: string
  formattedPlatformTotal: string
  formattedWorkedinCommission: string
  formattedWorkedinCommissionTps: string
  formattedWorkedinCommissionTvq: string
  formattedWorkedinCommissionTotal: string
  expertName: string
  expertEmail: string
  expertBusinessName?: string
  serviceName: string
  clientName: string
  transferPublicId?: string
  pdfDownloadUrl?: string
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function LineItem({ label, value, bold }: { label: string; value?: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between text-sm gap-4 ${bold ? "font-semibold" : ""}`}>
      <span className={bold ? "" : "text-muted-foreground"}>{label}</span>
      <span className="shrink-0">{value ?? "—"}</span>
    </div>
  )
}

// ── Receipt Dialog ───────────────────────────────────────────────────────────

function ReceiptContent({ receipt }: { receipt: ClientReceipt }) {
  return (
    <div className="flex flex-col gap-4 text-sm">
      {/* Header meta */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Receipt No. {receipt.receiptNumber}</span>
        <span>{receipt.formattedReceiptDate}</span>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-3 text-xs">
        <div>
          <p className="font-semibold mb-1">Expert</p>
          <p>{receipt.expertName}</p>
          <p className="text-muted-foreground">{receipt.expertEmail}</p>
          {receipt.expertPhoneNumber && <p className="text-muted-foreground">{receipt.expertPhoneNumber}</p>}
        </div>
        <div>
          <p className="font-semibold mb-1">Client</p>
          <p>{receipt.clientName}</p>
          <p className="text-muted-foreground">{receipt.clientEmail}</p>
          {receipt.clientPhoneNumber && <p className="text-muted-foreground">{receipt.clientPhoneNumber}</p>}
        </div>
      </div>

      {/* Service */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Service Purchased</p>
        <p className="font-medium">{receipt.requestName}</p>
      </div>

      <Separator />

      {/* Line items */}
      <div className="flex flex-col gap-2">
        <LineItem label="Service Price" value={receipt.formattedServicePrice} />
        <LineItem label="Platform Fee" value={receipt.formattedPlatformFee} />
        <LineItem label="GST / TPS (5%)" value={receipt.formattedCheckoutTps} />
        <LineItem label="QST / TVQ (9.975%)" value={receipt.formattedCheckoutTvq} />
        <Separator />
        <LineItem label="Total Paid by Client" value={receipt.formattedCheckoutTotal} bold />
        <LineItem label="Remaining Payment" value={receipt.formattedRemainingAmount} />
      </div>

      {/* Payment info */}
      <div className="rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground space-y-1">
        <p>Paid with {receipt.paymentMethod} ending in {receipt.paymentMethodLastFourDigits} on {receipt.formattedReceiptDate}.</p>
        <p>Payment Reference: {receipt.paymentIntentId}</p>
      </div>

      {/* Tax numbers */}
      {(receipt.expertTpsNumber || receipt.expertTvqNumber) && (
        <p className="text-xs text-muted-foreground">
          GST/TPS No. {receipt.expertTpsNumber || "N/A"} &nbsp;·&nbsp; QST/TVQ No. {receipt.expertTvqNumber || "N/A"}
        </p>
      )}

      {/* Legal */}
      <p className="text-xs text-muted-foreground leading-relaxed border-t pt-3">
        This receipt was issued by the Expert named above. Workedin Inc. acted solely as a facilitator of this transaction and is not the provider of the service.
      </p>

      {/* PDF */}
      {receipt.pdfDownloadUrl && (
        <Button variant="outline" size="sm" className="gap-2" asChild>
          <a href={receipt.pdfDownloadUrl} target="_blank" rel="noopener noreferrer">
            <Download className="size-3.5" /> Download PDF
          </a>
        </Button>
      )}
    </div>
  )
}

// ── Earnings Dialog ──────────────────────────────────────────────────────────

function EarningsContent({ report }: { report: EarningsReport }) {
  return (
    <div className="flex flex-col gap-4 text-sm">
      {/* Header meta */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Statement No. {report.earningsReportNumber}</span>
        <span>{report.formattedCreatedAt}</span>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-3 text-xs">
        <div>
          <p className="font-semibold mb-1">Expert</p>
          <p>{report.expertName}</p>
          {report.expertBusinessName && <p>{report.expertBusinessName}</p>}
          <p className="text-muted-foreground">{report.expertEmail}</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Service</p>
          <p>{report.serviceName}</p>
          <p className="text-muted-foreground">Client: {report.clientName}</p>
        </div>
      </div>

      <Separator />

      {/* Expert breakdown */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Expert — Breakdown</p>
        <div className="flex flex-col gap-1.5">
          <LineItem label="Total Amount Paid by Client" value={report.formattedAmount} />
          <LineItem label="Expert GST (TPS)" value={report.formattedExpertTps} />
          <LineItem label="Expert QST (TVQ)" value={report.formattedExpertTvq} />
          <LineItem label="Expert Brute Amount" value={report.formattedExpertBruteAmount} />
        </div>
      </div>

      <Separator />

      {/* Platform breakdown */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Platform — Breakdown</p>
        <div className="flex flex-col gap-1.5">
          <LineItem label="Platform Fee" value={report.formattedPlatformFee} />
          <LineItem label="Platform GST (TPS)" value={report.formattedPlatformTps} />
          <LineItem label="Platform QST (TVQ)" value={report.formattedPlatformTvq} />
          <LineItem label="Platform Total" value={report.formattedPlatformTotal} />
        </div>
      </div>

      <Separator />

      {/* Workedin commission */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Workedin — Commission</p>
        <div className="flex flex-col gap-1.5">
          <LineItem label="Commission" value={report.formattedWorkedinCommission} />
          <LineItem label="Commission GST (TPS)" value={report.formattedWorkedinCommissionTps} />
          <LineItem label="Commission QST (TVQ)" value={report.formattedWorkedinCommissionTvq} />
          <LineItem label="Commission Total" value={report.formattedWorkedinCommissionTotal} />
        </div>
      </div>

      <Separator />

      <LineItem label="Net Amount Transferred to Expert" value={report.formattedExpertPayoutAmount} bold />

      {report.transferPublicId && (
        <div className="rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
          Payout ID: {report.transferPublicId}
        </div>
      )}

      <p className="text-xs text-muted-foreground leading-relaxed border-t pt-3">
        This statement confirms a payout facilitated by Workedin Inc. for the service listed above.
      </p>

      {report.pdfDownloadUrl && (
        <Button variant="outline" size="sm" className="gap-2" asChild>
          <a href={report.pdfDownloadUrl} target="_blank" rel="noopener noreferrer">
            <Download className="size-3.5" /> Download PDF
          </a>
        </Button>
      )}
    </div>
  )
}

// ── Picker (when multiple docs) ──────────────────────────────────────────────

function ReceiptPicker({
  receipts,
  onSelect,
}: {
  receipts: ClientReceipt[]
  onSelect: (r: ClientReceipt) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">Select which receipt to view:</p>
      {receipts.map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => onSelect(r)}
          className="flex items-center justify-between rounded-lg border px-4 py-3 text-left hover:bg-muted/50 transition-colors"
        >
          <div>
            <p className="font-medium text-sm">{r.receiptNumber}</p>
            <p className="text-xs text-muted-foreground">{r.formattedReceiptDate} · {r.formattedCheckoutTotal}</p>
          </div>
          <ExternalLink className="size-4 text-muted-foreground" />
        </button>
      ))}
    </div>
  )
}

function EarningsPicker({
  reports,
  onSelect,
}: {
  reports: EarningsReport[]
  onSelect: (r: EarningsReport) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">Select which statement to view:</p>
      {reports.map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => onSelect(r)}
          className="flex items-center justify-between rounded-lg border px-4 py-3 text-left hover:bg-muted/50 transition-colors"
        >
          <div>
            <p className="font-medium text-sm">{r.earningsReportNumber}</p>
            <p className="text-xs text-muted-foreground">{r.formattedCreatedAt} · {r.formattedAmount}</p>
          </div>
          <ExternalLink className="size-4 text-muted-foreground" />
        </button>
      ))}
    </div>
  )
}

// ── Main exported component ──────────────────────────────────────────────────

type Props = {
  missionId: number
  /** Pass true on the expert (missions) page to also show the earnings statement */
  showEarnings?: boolean
}

export function MissionDocuments({ missionId, showEarnings = false }: Props) {
  // Receipt state
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [receiptLoading, setReceiptLoading] = useState(false)
  const [receipts, setReceipts] = useState<ClientReceipt[]>([])
  const [selectedReceipt, setSelectedReceipt] = useState<ClientReceipt | null>(null)

  // Earnings state
  const [earningsOpen, setEarningsOpen] = useState(false)
  const [earningsLoading, setEarningsLoading] = useState(false)
  const [earnings, setEarnings] = useState<EarningsReport[]>([])
  const [selectedEarnings, setSelectedEarnings] = useState<EarningsReport | null>(null)

  async function openReceipt() {
    setReceiptLoading(true)
    const res = await fetch(`/api/receipts/client/mission/${missionId}`)
    const data = await res.json().catch(() => ({ ok: false }))
    setReceiptLoading(false)

    if (!data.ok) return

    const list: ClientReceipt[] = Array.isArray(data.data) ? data.data : []
    if (!list.length) return

    const sorted = [...list].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    setReceipts(sorted)
    setSelectedReceipt(sorted.length === 1 ? sorted[0] : null)
    setReceiptOpen(true)
  }

  async function openEarnings() {
    setEarningsLoading(true)
    const res = await fetch(`/api/receipts/earnings/mission/${missionId}`)
    const data = await res.json().catch(() => ({ ok: false }))
    setEarningsLoading(false)

    if (!data.ok) return

    const list: EarningsReport[] = Array.isArray(data.data) ? data.data : []
    if (!list.length) return

    const sorted = [...list].sort((a, b) =>
      new Date(b.pdfDownloadUrl || "").localeCompare(a.pdfDownloadUrl || "")
    )
    setEarnings(sorted)
    setSelectedEarnings(sorted.length === 1 ? sorted[0] : null)
    setEarningsOpen(true)
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 justify-start"
          onClick={openReceipt}
          disabled={receiptLoading}
        >
          {receiptLoading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <FileText className="size-3.5" />
          )}
          View Receipt
        </Button>

        {showEarnings && (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 justify-start"
            onClick={openEarnings}
            disabled={earningsLoading}
          >
            {earningsLoading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <TrendingUp className="size-3.5" />
            )}
            View Earnings Statement
          </Button>
        )}
      </div>

      {/* Receipt dialog */}
      <Dialog open={receiptOpen} onOpenChange={(o) => { setReceiptOpen(o); if (!o) setSelectedReceipt(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedReceipt && receipts.length > 1 && (
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="mr-1 text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="size-4" />
                </button>
              )}
              {selectedReceipt ? "Service Receipt" : "Select Receipt"}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-1">
            {selectedReceipt ? (
              <ReceiptContent receipt={selectedReceipt} />
            ) : (
              <ReceiptPicker receipts={receipts} onSelect={setSelectedReceipt} />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Earnings dialog */}
      <Dialog open={earningsOpen} onOpenChange={(o) => { setEarningsOpen(o); if (!o) setSelectedEarnings(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedEarnings && earnings.length > 1 && (
                <button
                  type="button"
                  onClick={() => setSelectedEarnings(null)}
                  className="mr-1 text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="size-4" />
                </button>
              )}
              {selectedEarnings ? "Earnings Statement" : "Select Statement"}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-1">
            {selectedEarnings ? (
              <EarningsContent report={selectedEarnings} />
            ) : (
              <EarningsPicker reports={earnings} onSelect={setSelectedEarnings} />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
