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
      setError("Please select an estimated completion date.")
      return
    }
    if (isBackdated(estimatedCompletionDate)) {
      setError("Estimated completion date cannot be in the past.")
      return
    }
    if (availability === "date") {
      if (!availabilityDate) {
        setError("Please select your availability date.")
        return
      }
      if (isBackdated(availabilityDate)) {
        setError("Availability date cannot be in the past.")
        return
      }
    }
    if (price && (isNaN(Number(price)) || Number(price) <= 0)) {
      setError("Price must be a positive number.")
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
        (data as { message?: string }).message ?? "You must verify your identity before applying."
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
      setError((data as { message?: string }).message ?? "Failed to submit application. Please try again.")
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
        Already Applied
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
            Apply to this Request
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Your Application</DialogTitle>
            <DialogDescription>
              Write a proposal explaining how you can help the client.
            </DialogDescription>
          </DialogHeader>

          {success ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
              <CheckCircle className="size-12 text-green-600" />
              <p className="font-semibold">Application submitted!</p>
              <p className="text-sm text-muted-foreground">
                The client will review your proposal and get back to you.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Message */}
              <div className="grid gap-2">
                <Label htmlFor="message">Proposal Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your approach, relevant experience, and why you're the right person for this request..."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Price */}
              <div className="grid gap-2">
                <Label htmlFor="price">
                  {isFixed ? "Your Bid (CAD)" : "Price Proposal (CAD)"}{" "}
                  <span className="text-muted-foreground font-normal">— optional</span>
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
                  Estimated Completion Date <span className="text-destructive">*</span>
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
                <Label>Availability</Label>
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
                    Available now
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
                    Choose a date
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
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Application"}
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
              <DialogTitle>Verification Required</DialogTitle>
            </div>
            <DialogDescription>
              {forbiddenMessage ?? "You must complete identity verification before applying to requests."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setForbiddenOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setForbiddenOpen(false)
                router.push("/account/status")
              }}
            >
              Start Verification
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
            <DialogTitle className="text-base">Stripe Account Required</DialogTitle>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-3">
            <div className="flex justify-center mb-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                <ShieldCheck className="size-8 text-foreground" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              WorkedIn uses Stripe, a trusted global payments provider, to handle all transactions securely.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To apply for requests and receive payments, you must connect your Stripe account.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Without completing this setup, you won't be able to get paid for your work.
            </p>

            {/* Stripe branding */}
            <div className="flex items-center gap-3 rounded-lg bg-muted/60 px-4 py-3 mt-2">
              <div className="flex size-9 items-center justify-center rounded-md bg-[#635BFF] shrink-0">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <p className="text-sm font-semibold">Powered by Stripe</p>
                <p className="text-xs text-muted-foreground">Trusted by millions worldwide</p>
              </div>
            </div>

            <a
              href="https://stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-xs text-primary underline underline-offset-2"
            >
              Learn more about why Stripe is required
            </a>
          </div>

          {/* Actions */}
          <div className="px-6 pb-5 flex flex-col gap-2">
            <Button className="w-full" onClick={handleStripeSetup} disabled={stripeLoading}>
              {stripeLoading ? "Opening..." : "Proceed to Stripe Setup"}
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => setStripeOpen(false)}>
              Cancel
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
