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
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{t("documents.receiptNo", { number: receipt.receiptNumber })}</span>
        <span>{receipt.formattedReceiptDate}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-3 text-xs">
        <div>
          <p className="font-semibold mb-1">{t("common.expert")}</p>
          <p>{receipt.expertName}</p>
          <p className="text-muted-foreground">{receipt.expertEmail}</p>
          {receipt.expertPhoneNumber && <p className="text-muted-foreground">{receipt.expertPhoneNumber}</p>}
        </div>
        <div>
          <p className="font-semibold mb-1">{t("common.client")}</p>
          <p>{receipt.clientName}</p>
          <p className="text-muted-foreground">{receipt.clientEmail}</p>
          {receipt.clientPhoneNumber && <p className="text-muted-foreground">{receipt.clientPhoneNumber}</p>}
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{t("documents.servicePurchased")}</p>
        <p className="font-medium">{receipt.requestName}</p>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <LineItem label={t("documents.servicePrice")} value={receipt.formattedServicePrice} />
        <LineItem label={t("checkout.platformFee")} value={receipt.formattedPlatformFee} />
        <LineItem label={t("documents.gstTps")} value={receipt.formattedCheckoutTps} />
        <LineItem label={t("documents.qstTvq")} value={receipt.formattedCheckoutTvq} />
        <Separator />
        <LineItem label={t("documents.totalPaidByClient")} value={receipt.formattedCheckoutTotal} bold />
        <LineItem label={t("documents.remainingPayment")} value={receipt.formattedRemainingAmount} />
      </div>

      <div className="rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground space-y-1">
        <p>{t("documents.paidWith", { method: receipt.paymentMethod, last4: receipt.paymentMethodLastFourDigits, date: receipt.formattedReceiptDate })}</p>
        <p>{t("documents.paymentRef", { id: receipt.paymentIntentId })}</p>
      </div>

      {(receipt.expertTpsNumber || receipt.expertTvqNumber) && (
        <p className="text-xs text-muted-foreground">
          GST/TPS No. {receipt.expertTpsNumber || "N/A"} &nbsp;·&nbsp; QST/TVQ No. {receipt.expertTvqNumber || "N/A"}
        </p>
      )}

      <p className="text-xs text-muted-foreground leading-relaxed border-t pt-3">
        {t("documents.receiptDisclaimer")}
      </p>

      {receipt.pdfDownloadUrl && (
        <Button variant="outline" size="sm" className="gap-2" asChild>
          <a href={receipt.pdfDownloadUrl} target="_blank" rel="noopener noreferrer">
            <Download className="size-3.5" /> {t("documents.downloadPdf")}
          </a>
        </Button>
      )}
    </div>
  )
}

// ── Earnings Dialog ──────────────────────────────────────────────────────────

function EarningsContent({ report }: { report: EarningsReport }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{t("documents.statementNo", { number: report.earningsReportNumber })}</span>
        <span>{report.formattedCreatedAt}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-3 text-xs">
        <div>
          <p className="font-semibold mb-1">{t("common.expert")}</p>
          <p>{report.expertName}</p>
          {report.expertBusinessName && <p>{report.expertBusinessName}</p>}
          <p className="text-muted-foreground">{report.expertEmail}</p>
        </div>
        <div>
          <p className="font-semibold mb-1">{t("documents.service")}</p>
          <p>{report.serviceName}</p>
          <p className="text-muted-foreground">{t("documents.clientLabel", { name: report.clientName })}</p>
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{t("documents.expertBreakdown")}</p>
        <div className="flex flex-col gap-1.5">
          <LineItem label={t("documents.totalPaidByClient")} value={report.formattedAmount} />
          <LineItem label={t("documents.expertGst")} value={report.formattedExpertTps} />
          <LineItem label={t("documents.expertQst")} value={report.formattedExpertTvq} />
          <LineItem label={t("documents.expertBruteAmount")} value={report.formattedExpertBruteAmount} />
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{t("documents.platformBreakdown")}</p>
        <div className="flex flex-col gap-1.5">
          <LineItem label={t("checkout.platformFee")} value={report.formattedPlatformFee} />
          <LineItem label={t("documents.platformGst")} value={report.formattedPlatformTps} />
          <LineItem label={t("documents.platformQst")} value={report.formattedPlatformTvq} />
          <LineItem label={t("documents.platformTotal")} value={report.formattedPlatformTotal} />
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{t("documents.workedinCommission")}</p>
        <div className="flex flex-col gap-1.5">
          <LineItem label={t("documents.commission")} value={report.formattedWorkedinCommission} />
          <LineItem label={t("documents.commissionGst")} value={report.formattedWorkedinCommissionTps} />
          <LineItem label={t("documents.commissionQst")} value={report.formattedWorkedinCommissionTvq} />
          <LineItem label={t("documents.commissionTotal")} value={report.formattedWorkedinCommissionTotal} />
        </div>
      </div>

      <Separator />

      <LineItem label={t("documents.netTransferred")} value={report.formattedExpertPayoutAmount} bold />

      {report.transferPublicId && (
        <div className="rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
          {t("documents.payoutId", { id: report.transferPublicId })}
        </div>
      )}

      <p className="text-xs text-muted-foreground leading-relaxed border-t pt-3">
        {t("documents.earningsDisclaimer")}
      </p>

      {report.pdfDownloadUrl && (
        <Button variant="outline" size="sm" className="gap-2" asChild>
          <a href={report.pdfDownloadUrl} target="_blank" rel="noopener noreferrer">
            <Download className="size-3.5" /> {t("documents.downloadPdf")}
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
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">{t("documents.selectReceipt")}</p>
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
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">{t("documents.selectStatement")}</p>
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
  const { t } = useTranslation()

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
          {t("documents.viewReceipt")}
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
            {t("documents.viewEarningsStatement")}
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
              {selectedReceipt ? t("documents.serviceReceipt") : t("documents.selectReceiptTitle")}
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
              {selectedEarnings ? t("documents.earningsStatement") : t("documents.selectStatementTitle")}
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
