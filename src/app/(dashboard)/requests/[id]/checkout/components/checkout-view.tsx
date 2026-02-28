"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useCheckoutStore } from "@/store/checkoutStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Tag, X, Info, Loader2 } from "lucide-react"
import { StripePaymentForm } from "./stripe-payment-form"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

type Props = { requestId: number }

export function CheckoutView({ requestId }: Props) {
  const router = useRouter()
  const { details, appliedPromoCodes, setAppliedPromoCodes, reset } =
    useCheckoutStore()

  const [promoInput, setPromoInput] = useState("")
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)

  // Stripe state
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [intentLoading, setIntentLoading] = useState(false)
  const [intentError, setIntentError] = useState<string | null>(null)

  if (!details) {
    return (
      <div className="px-4 lg:px-6 max-w-xl">
        <p className="text-muted-foreground text-sm">
          No checkout session found.{" "}
          <Link href={`/requests/${requestId}`} className="underline">
            Go back to the request.
          </Link>
        </p>
      </div>
    )
  }

  const {
    expertName,
    expertAvatar,
    requestTitle,
    finalPrice,
    subTotal,
    platformFee,
    tps,
    tvq,
    total,
    applicationEntryId,
  } = details

  const expertInitials =
    expertName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?"

  async function applyPromoCode() {
    const code = promoInput.trim().toUpperCase()
    if (!code) return
    if (appliedPromoCodes.includes(code)) {
      setPromoError("Promo code already applied.")
      return
    }

    setPromoLoading(true)
    setPromoError(null)
    const res = await fetch(`/api/promo-codes/${code}`)
    const data = await res.json().catch(() => ({}))
    setPromoLoading(false)

    if (!res.ok || !data.ok) {
      setPromoError(data.message ?? "Invalid promo code.")
      return
    }
    setAppliedPromoCodes([...appliedPromoCodes, code])
    setPromoInput("")
  }

  async function handleInitiatePayment() {
    setIntentLoading(true)
    setIntentError(null)

    const res = await fetch("/api/stripe/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: finalPrice,
        currency: "CAD",
        promoCodes: appliedPromoCodes,
        applicationEntryId,
      }),
    })

    const data = await res.json().catch(() => ({}))
    setIntentLoading(false)

    if (!res.ok || !data.ok) {
      setIntentError(
        data.message ?? "Failed to initiate payment. Please try again."
      )
      return
    }

    // Backend returns PaymentSheetParamsDTO — we need the clientSecret (intent field)
    setClientSecret(data.data?.intent ?? data.data?.clientSecret ?? null)
  }

  function handlePaymentSuccess(missionId?: number) {
    reset()
    // Redirect directly to the newly created mission (job) page
    router.push(missionId ? `/jobs/${missionId}` : "/jobs")
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-xl">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link
            href={`/requests/${requestId}`}
            className="flex items-center gap-1 text-muted-foreground"
          >
            <ArrowLeft className="size-3" /> Back to Request
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review your order before pre-authorizing payment.
        </p>
      </div>

      {/* Order summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarImage src={expertAvatar} alt={expertName} />
              <AvatarFallback>{expertInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{expertName}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {requestTitle}
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Mission price</span>
            <span className="font-medium">
              $
              {Number(finalPrice).toLocaleString("en-CA", {
                minimumFractionDigits: 2,
              })}{" "}
              CAD
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Promo code — only before payment is initiated */}
      {!clientSecret && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Tag className="size-4" /> Promo Code
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter promo code"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && applyPromoCode()}
              />
              <Button
                variant="outline"
                onClick={applyPromoCode}
                disabled={promoLoading || !promoInput.trim()}
              >
                {promoLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
            {promoError && (
              <p className="text-xs text-destructive">{promoError}</p>
            )}
            {appliedPromoCodes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {appliedPromoCodes.map((code) => (
                  <Badge
                    key={code}
                    variant="secondary"
                    className="gap-1.5 pr-1.5"
                  >
                    {code}
                    <button
                      type="button"
                      onClick={() =>
                        setAppliedPromoCodes(
                          appliedPromoCodes.filter((c) => c !== code)
                        )
                      }
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Order breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>
              $
              {Number(subTotal).toLocaleString("en-CA", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          {platformFee > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform fee</span>
              <span>
                $
                {Number(platformFee).toLocaleString("en-CA", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          )}
          {tps > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">TPS (GST)</span>
              <span>
                $
                {Number(tps).toLocaleString("en-CA", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          )}
          {tvq > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">TVQ (QST)</span>
              <span>
                $
                {Number(tvq).toLocaleString("en-CA", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>
              $
              {Number(total).toLocaleString("en-CA", {
                minimumFractionDigits: 2,
              })}{" "}
              CAD
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Pre-auth notice */}
      <div className="rounded-xl border bg-muted/50 px-4 py-4 flex gap-3 text-sm text-muted-foreground">
        <Info className="size-4 mt-0.5 shrink-0 text-primary" />
        <p>
          By pre-authorizing, you&apos;re <strong>not being charged yet</strong>
          . The expert must complete the work first. You&apos;ll be charged only
          after you approve the completed work.{" "}
          <a href="#" className="underline">
            Terms &amp; Conditions
          </a>
        </p>
      </div>

      {intentError && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
          {intentError}
        </p>
      )}

      {/* Payment area */}
      {!clientSecret ? (
        <Button
          size="lg"
          onClick={handleInitiatePayment}
          disabled={intentLoading}
          className="gap-2 w-full"
        >
          {intentLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Preparing payment...
            </>
          ) : (
            `Pre-Authorize $${Number(total).toLocaleString("en-CA", {
              minimumFractionDigits: 2,
            })} CAD`
          )}
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, locale: "en" }}
            >
              <StripePaymentForm
                applicationEntryId={applicationEntryId}
                total={total}
                onSuccess={handlePaymentSuccess}
                onError={(msg) => setIntentError(msg)}
              />
            </Elements>
          </CardContent>
        </Card>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Secured by <strong>Stripe</strong>. Your card information is never
        stored on our servers.
      </p>
    </div>
  )
}
