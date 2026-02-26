"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProfileSetupStore } from "@/store/profileSetupStore"
import {
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Info,
  Link2,
  Lock,
  MapPin,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const COUNTRIES = [
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
]

// ─── Expert: Stripe Connect ───────────────────────────────────────────────────

const EXPERT_BENEFITS = [
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

function ExpertPayment() {
  const { personal, payment, setPayment, nextStep, prevStep } = useProfileSetupStore()
  const [connecting, setConnecting] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [onboardingOpened, setOnboardingOpened] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const stripeConnected = payment.stripeConnected

  async function handleConnect() {
    setConnecting(true)
    setError(null)
    try {
      const res = await fetch("/api/stripe/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: personal.firstName, lastName: personal.lastName }),
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

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-blue-50 dark:bg-blue-950/40 p-5 flex gap-4 items-start">
        <div className="rounded-lg bg-white dark:bg-muted p-2.5 shrink-0">
          <StripeLogo className="h-5 w-12" />
        </div>
        <div>
          <p className="font-semibold text-sm">Connect your Stripe account</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Required to receive payouts when clients approve your work.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {EXPERT_BENEFITS.map((b) => (
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
            <Button type="button" variant="outline" className="w-full gap-2" onClick={handleConnect} disabled={connecting}>
              <ExternalLink className="size-4" />
              {connecting ? "Opening Stripe…" : "Connect with Stripe"}
            </Button>
            {onboardingOpened && (
              <Button type="button" variant="secondary" className="w-full gap-2" onClick={handleVerify} disabled={verifying}>
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

      <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-3 flex gap-2 text-sm">
        <Info className="size-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-amber-800 dark:text-amber-300">
          <span className="font-semibold">Important:</span> You must connect Stripe before accepting your first mission. You can also do this later from your account settings.
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <div className="flex gap-3">
          {!stripeConnected && (
            <Button variant="ghost" onClick={() => { setPayment({ skipped: true }); nextStep() }}>
              Skip for now
            </Button>
          )}
          {stripeConnected && <Button onClick={nextStep}>Continue</Button>}
        </div>
      </div>
    </div>
  )
}

// ─── Client: Card collection ──────────────────────────────────────────────────

function ClientCardFormInner() {
  const { payment, setPayment, nextStep, prevStep } = useProfileSetupStore()
  const stripe = useStripe()
  const elements = useElements()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const [cardholderName, setCardholderName] = useState(payment.cardholderName)
  const [billingCountry, setBillingCountry] = useState(payment.billingCountry || "CA")
  const [billingPostalCode, setBillingPostalCode] = useState(payment.billingPostalCode)
  const [cardComplete, setCardComplete] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "15px",
        color: isDark ? "#f8fafc" : "#0f172a",
        fontFamily: "inherit",
        "::placeholder": { color: isDark ? "#64748b" : "#94a3b8" },
      },
      invalid: { color: "#ef4444" },
    },
    hidePostalCode: true,
  }

  async function handleContinue() {
    setError(null)

    // If card is fully filled in, save the payment method before advancing
    if (cardComplete) {
      if (!stripe || !elements) return
      setSaving(true)
      try {
        const cardElement = elements.getElement(CardElement)
        if (!cardElement) throw new Error("Card element not found")
        const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: cardholderName || undefined,
            address: {
              country: billingCountry,
              postal_code: billingPostalCode || undefined,
            },
          },
        })
        if (stripeError) throw new Error(stripeError.message)
        setPayment({
          paymentMethodId: paymentMethod!.id,
          cardholderName,
          billingCountry,
          billingPostalCode,
          skipped: false,
        })
      } catch (err: any) {
        setError(err.message)
        setSaving(false)
        return
      }
      setSaving(false)
    } else {
      // Card not filled — skip silently (matches mobile behaviour)
      setPayment({ skipped: true })
    }

    nextStep()
  }

  const selectedCountry = COUNTRIES.find((c) => c.code === billingCountry)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-xl border bg-violet-50 dark:bg-violet-950/40 p-5 flex gap-4 items-start">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-muted">
          <CreditCard className="size-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <p className="font-semibold text-sm">Add a payment method</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Securely pay for missions through Workedin&apos;s protected checkout.
          </p>
        </div>
      </div>

      {/* Card details */}
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardholderName">Cardholder name</Label>
          <Input
            id="cardholderName"
            placeholder="Name on card"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Card details</Label>
          <div className={cn(
            "rounded-md border px-3 py-3 transition-colors",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          )}>
            <CardElement
              options={cardElementOptions}
              onChange={(e) => setCardComplete(e.complete)}
            />
          </div>
        </div>

        {/* Billing address */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="size-4 text-muted-foreground" />
            Billing address
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingCountry">Country</Label>
            <Select value={billingCountry} onValueChange={setBillingCountry}>
              <SelectTrigger id="billingCountry">
                <SelectValue>
                  {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : "Select country"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingPostal">Postal / ZIP code</Label>
            <Input
              id="billingPostal"
              placeholder="e.g. H3Z 2Y7"
              value={billingPostalCode}
              onChange={(e) => setBillingPostalCode(e.target.value.toUpperCase())}
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {/* Security row */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3" />
          SSL encrypted
        </div>
        <div className="flex gap-1.5">
          {["VISA", "MC", "AMEX"].map((brand) => (
            <span key={brand} className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-muted text-muted-foreground">
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* Info notice */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-3 flex gap-2 text-sm">
        <Info className="size-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-amber-800 dark:text-amber-300">
          Your card will only be charged when you approve an expert&apos;s work. You can update your payment method anytime.
        </p>
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <Button variant="ghost" onClick={handleContinue} disabled={saving}>
          {saving ? "Saving…" : "Skip for now"}
        </Button>
      </div>
    </div>
  )
}

function ClientPayment() {
  return (
    <Elements stripe={stripePromise}>
      <ClientCardFormInner />
    </Elements>
  )
}

// ─── Root export ──────────────────────────────────────────────────────────────

export function Step5Payment() {
  const { accountType } = useProfileSetupStore()
  return accountType === "expert" ? <ExpertPayment /> : <ClientPayment />
}

// ─── Shared ───────────────────────────────────────────────────────────────────

function StripeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 25" className={className} aria-label="Stripe">
      <path
        d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V6.27h3.64l.24 1.02a4.3 4.3 0 0 1 3.15-1.26c2.96 0 5.58 2.46 5.58 7.4 0 5.23-2.6 6.87-5.57 6.87zm-.94-10.17c-.97 0-1.54.34-1.98.81l.02 6.12c.4.44.97.77 1.96.77 1.5 0 2.54-1.65 2.54-3.87 0-2.15-1.06-3.83-2.54-3.83zM28.24 5.07c1.36 0 2.18-.89 2.18-2 0-1.16-.86-2-2.18-2-1.32 0-2.18.84-2.18 2 0 1.11.86 2 2.18 2zm2.07 15.16h-4.16V6.27h4.16zm-6.48 0H19.67V.9l-4.15.88v19.45h4.15V.9l4.16-.88zM14.05 6.27H9.9v9.68c0 1.77.93 2.47 2.26 2.47.67 0 1.24-.14 1.78-.38v3.16a5.47 5.47 0 0 1-2.74.6C8.6 21.8 5.75 20 5.75 15.95V6.27H3.55V3.04h2.2V.48l4.15-.88v3.44h4.15v3.23z"
        fill="currentColor"
      />
    </svg>
  )
}
