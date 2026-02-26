"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useProfileSetupStore } from "@/store/profileSetupStore"
import { CheckCircle2, ExternalLink, Info, Link2, RefreshCw, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const BENEFITS = [
  {
    title: "Fast, secure payouts",
    text: "Get paid directly to your bank account within 2–7 business days after client approval.",
  },
  {
    title: "Industry-standard security",
    text: "Stripe is trusted by millions of businesses worldwide with bank-grade encryption.",
  },
  {
    title: "Full payment control",
    text: "Track your earnings, manage your payout schedule, and view transaction history.",
  },
]

export function Step5Payment() {
  const { accountType, personal, payment, setPayment, nextStep, prevStep } = useProfileSetupStore()
  const isExpert = accountType === "expert"

  const [connecting, setConnecting] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [onboardingOpened, setOnboardingOpened] = useState(false)

  const stripeConnected = payment.stripeConnected

  async function handleConnect() {
    setConnecting(true)
    setError(null)
    try {
      const res = await fetch("/api/stripe/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: personal.firstName,
          lastName: personal.lastName,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.message ?? "Could not start Stripe onboarding")
      const url: string = json.data?.url
      if (!url) throw new Error("No onboarding URL returned")
      window.open(url, "_blank", "noopener,noreferrer")
      setOnboardingOpened(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setConnecting(false)
    }
  }

  async function handleVerify() {
    setVerifying(true)
    setError(null)
    try {
      const res = await fetch("/api/stripe/connect")
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.message ?? "Could not check status")
      const connected: boolean = json.data?.connected ?? json.data?.status === "active"
      if (connected) {
        setPayment({ stripeConnected: true, skipped: false })
      } else {
        setError("Your Stripe account is not connected yet. Complete the onboarding in the Stripe tab and try again.")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setVerifying(false)
    }
  }

  function handleSkip() {
    setPayment({ skipped: true })
    nextStep()
  }

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="rounded-xl border bg-blue-50 dark:bg-blue-950/40 p-5 flex gap-4 items-start">
        <div className="rounded-lg bg-white dark:bg-muted p-2.5 shrink-0">
          <svg viewBox="0 0 60 25" className="h-5 w-12" aria-label="Stripe">
            <path
              d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V6.27h3.64l.24 1.02a4.3 4.3 0 0 1 3.15-1.26c2.96 0 5.58 2.46 5.58 7.4 0 5.23-2.6 6.87-5.57 6.87zm-.94-10.17c-.97 0-1.54.34-1.98.81l.02 6.12c.4.44.97.77 1.96.77 1.5 0 2.54-1.65 2.54-3.87 0-2.15-1.06-3.83-2.54-3.83zM28.24 5.07c1.36 0 2.18-.89 2.18-2 0-1.16-.86-2-2.18-2-1.32 0-2.18.84-2.18 2 0 1.11.86 2 2.18 2zm2.07 15.16h-4.16V6.27h4.16zm-6.48 0H19.67V.9l-4.15.88v19.45h4.15V.9l4.16-.88zM14.05 6.27H9.9v9.68c0 1.77.93 2.47 2.26 2.47.67 0 1.24-.14 1.78-.38v3.16a5.47 5.47 0 0 1-2.74.6C8.6 21.8 5.75 20 5.75 15.95V6.27H3.55V3.04h2.2V.48l4.15-.88v3.44h4.15v3.23z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-sm">Connect your Stripe account</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Required to receive payouts when clients approve your work.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-3">
        {BENEFITS.map((b) => (
          <div key={b.title} className="flex gap-3 items-start">
            <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
              <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold">{b.title}</p>
              <p className="text-sm text-muted-foreground">{b.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Account card */}
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="flex items-center gap-3">
          <Link2 className="size-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Stripe account</p>
            <p className={cn("text-sm", stripeConnected ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
              {stripeConnected ? "Connected" : "Not connected"}
            </p>
          </div>
          <div className={cn("size-2.5 rounded-full shrink-0", stripeConnected ? "bg-emerald-500" : "bg-muted-foreground/30")} />
        </div>

        {stripeConnected ? (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="size-4 shrink-0" />
            Your Stripe account is connected. You&apos;re ready to receive payouts.
          </div>
        ) : (
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={handleConnect}
              disabled={connecting}
            >
              <ExternalLink className="size-4" />
              {connecting ? "Opening Stripe…" : "Connect with Stripe"}
            </Button>

            {onboardingOpened && !stripeConnected && (
              <Button
                type="button"
                variant="secondary"
                className="w-full gap-2"
                onClick={handleVerify}
                disabled={verifying}
              >
                <RefreshCw className={cn("size-4", verifying && "animate-spin")} />
                {verifying ? "Checking…" : "Verify connection"}
              </Button>
            )}

            <p className="text-center text-xs text-muted-foreground">
              You&apos;ll be redirected to Stripe&apos;s secure onboarding in a new tab.
            </p>
          </div>
        )}
      </div>

      {/* Info notice */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-3 flex gap-2 text-sm">
        <Info className="size-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-amber-800 dark:text-amber-300">
          <span className="font-semibold">Important:</span> You must connect Stripe before accepting your first mission. You can also do this later from your account settings.
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <div className="flex gap-3">
          {!stripeConnected && (
            <Button variant="ghost" onClick={handleSkip}>Skip for now</Button>
          )}
          {stripeConnected && (
            <Button onClick={nextStep}>Continue</Button>
          )}
        </div>
      </div>
    </div>
  )
}
