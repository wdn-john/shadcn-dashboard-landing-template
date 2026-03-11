"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Send, CheckCircle, CalendarIcon, ShieldCheck, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

type Props = {
  serviceRequestId: number
  budgetOption: string
  alreadyApplied: boolean
}

const today = new Date().toISOString().split("T")[0]

function isBackdated(dateStr: string) {
  return dateStr < today
}

export function ApplyForm({ serviceRequestId, budgetOption, alreadyApplied }: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [price, setPrice] = useState("")
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState("")
  const [availability, setAvailability] = useState<"now" | "date">("now")
  const [availabilityDate, setAvailabilityDate] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // 403 — identity verification required
  const [forbiddenOpen, setForbiddenOpen] = useState(false)
  const [forbiddenMessage, setForbiddenMessage] = useState<string | null>(null)

  // 428 — Stripe account not set up
  const [stripeOpen, setStripeOpen] = useState(false)
  const [stripeLoading, setStripeLoading] = useState(false)

  const isFixed = budgetOption === "Fixed" || budgetOption === "FIXED"

  function resetForm() {
    setMessage("")
    setPrice("")
    setEstimatedCompletionDate("")
    setAvailability("now")
    setAvailabilityDate("")
    setError(null)
    setSuccess(false)
  }

  function handleOpenChange(val: boolean) {
    setOpen(val)
    if (!val) resetForm()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!estimatedCompletionDate) {
      setError(t("applyForm.completionRequired"))
      return
    }
    if (isBackdated(estimatedCompletionDate)) {
      setError(t("applyForm.completionPast"))
      return
    }
    if (availability === "date") {
      if (!availabilityDate) {
        setError(t("applyForm.availabilityRequired"))
        return
      }
      if (isBackdated(availabilityDate)) {
        setError(t("applyForm.availabilityPast"))
        return
      }
    }
    if (price && (isNaN(Number(price)) || Number(price) <= 0)) {
      setError(t("applyForm.pricePositive"))
      return
    }

    setSubmitting(true)

    const body: Record<string, unknown> = {
      serviceRequestId,
      message: message.trim(),
      estimatedCompletionDate,
      availability: availability === "date" ? availabilityDate : "now",
    }
    if (price) body.price = parseFloat(price)

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await res.json().catch(() => ({}))
    setSubmitting(false)

    // Identity verification required
    if (res.status === 403) {
      setOpen(false)
      setForbiddenMessage(
        (data as { message?: string }).message ?? t("applyForm.verificationDefault")
      )
      setForbiddenOpen(true)
      return
    }

    // Stripe account not connected
    if (res.status === 428) {
      setOpen(false)
      setStripeOpen(true)
      return
    }

    if (!res.ok || !(data as { ok?: boolean }).ok) {
      setError((data as { message?: string }).message ?? t("applyForm.submitFailed"))
      return
    }

    setSuccess(true)
    setTimeout(() => {
      setOpen(false)
      router.refresh()
    }, 1500)
  }

  async function handleStripeSetup() {
    setStripeLoading(true)
    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" })
      const data = await res.json().catch(() => ({}))
      if ((data as { url?: string }).url) {
        window.open((data as { url: string }).url, "_blank")
      }
    } finally {
      setStripeLoading(false)
      setStripeOpen(false)
    }
  }

  if (alreadyApplied) {
    return (
      <Button variant="outline" disabled className="flex items-center gap-2">
        <CheckCircle className="size-4 text-green-600" />
        {t("applyForm.alreadyApplied")}
      </Button>
    )
  }

  return (
    <>
      {/* ── Apply dialog ─────────────────────────────────────────────────── */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Send className="size-4" />
            {t("applyForm.applyButton")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("applyForm.dialogTitle")}</DialogTitle>
            <DialogDescription>
              {t("applyForm.dialogDesc")}
            </DialogDescription>
          </DialogHeader>

          {success ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
              <CheckCircle className="size-12 text-green-600" />
              <p className="font-semibold">{t("applyForm.successTitle")}</p>
              <p className="text-sm text-muted-foreground">
                {t("applyForm.successDesc")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Message */}
              <div className="grid gap-2">
                <Label htmlFor="message">{t("applyForm.proposalMessage")}</Label>
                <Textarea
                  id="message"
                  placeholder={t("applyForm.proposalPlaceholder")}
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Price */}
              <div className="grid gap-2">
                <Label htmlFor="price">
                  {isFixed ? t("applyForm.bidFixed") : t("applyForm.bidVariable")}{" "}
                  <span className="text-muted-foreground font-normal">{t("applyForm.optional")}</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input
                    id="price"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-7"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Estimated completion date (required) */}
              <div className="grid gap-2">
                <Label htmlFor="estimatedCompletionDate">
                  {t("applyForm.completionDate")} <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="estimatedCompletionDate"
                    type="date"
                    min={today}
                    value={estimatedCompletionDate}
                    onChange={(e) => setEstimatedCompletionDate(e.target.value)}
                  />
                  <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                </div>
              </div>

              {/* Availability */}
              <div className="grid gap-2">
                <Label>{t("applyForm.availability")}</Label>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setAvailability("now")}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-sm text-left transition-all",
                      availability === "now"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                        availability === "now" ? "border-primary" : "border-muted-foreground/40"
                      )}
                    >
                      {availability === "now" && (
                        <span className="size-2 rounded-full bg-primary" />
                      )}
                    </span>
                    {t("applyForm.availableNow")}
                  </button>

                  <button
                    type="button"
                    onClick={() => setAvailability("date")}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-sm text-left transition-all",
                      availability === "date"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                        availability === "date" ? "border-primary" : "border-muted-foreground/40"
                      )}
                    >
                      {availability === "date" && (
                        <span className="size-2 rounded-full bg-primary" />
                      )}
                    </span>
                    {t("applyForm.chooseDate")}
                  </button>
                </div>

                {availability === "date" && (
                  <div className="relative">
                    <Input
                      type="date"
                      min={today}
                      value={availabilityDate}
                      onChange={(e) => setAvailabilityDate(e.target.value)}
                    />
                    <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  </div>
                )}
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <DialogFooter className="mt-2">
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  {t("applyForm.cancel")}
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? t("applyForm.submitting") : t("applyForm.submit")}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Identity verification required (403) ─────────────────────────── */}
      <Dialog open={forbiddenOpen} onOpenChange={setForbiddenOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 shrink-0">
                <ShieldCheck className="size-5 text-amber-600" />
              </div>
              <DialogTitle>{t("applyForm.verificationRequired")}</DialogTitle>
            </div>
            <DialogDescription>
              {forbiddenMessage ?? t("applyForm.verificationDefault")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setForbiddenOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              onClick={() => {
                setForbiddenOpen(false)
                router.push("/account/status")
              }}
            >
              {t("applyForm.startVerification")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Stripe account required (428) ────────────────────────────────── */}
      <Dialog open={stripeOpen} onOpenChange={setStripeOpen}>
        <DialogContent className="sm:max-w-sm p-0 gap-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b">
            <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 shrink-0">
              <Lock className="size-5 text-emerald-600" />
            </div>
            <DialogTitle className="text-base">{t("applyForm.stripeRequired")}</DialogTitle>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-3">
            <div className="flex justify-center mb-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                <ShieldCheck className="size-8 text-foreground" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("applyForm.stripeBody1")}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("applyForm.stripeBody2")}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("applyForm.stripeBody3")}
            </p>

            {/* Stripe branding */}
            <div className="flex items-center gap-3 rounded-lg bg-muted/60 px-4 py-3 mt-2">
              <div className="flex size-9 items-center justify-center rounded-md bg-[#635BFF] shrink-0">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <p className="text-sm font-semibold">{t("applyForm.poweredByStripe")}</p>
                <p className="text-xs text-muted-foreground">{t("applyForm.stripeTrusted")}</p>
              </div>
            </div>

            <a
              href="https://stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-xs text-primary underline underline-offset-2"
            >
              {t("applyForm.stripeLearnMore")}
            </a>
          </div>

          {/* Actions */}
          <div className="px-6 pb-5 flex flex-col gap-2">
            <Button className="w-full" onClick={handleStripeSetup} disabled={stripeLoading}>
              {stripeLoading ? t("applyForm.stripeOpening") : t("applyForm.stripeSetup")}
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => setStripeOpen(false)}>
              {t("common.cancel")}
            </Button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t px-6 py-3 text-xs text-muted-foreground">
            <span>🔒 SSL Encrypted</span>
            <span>🛡 Bank-level Security</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
