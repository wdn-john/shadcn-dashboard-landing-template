"use client"

import { useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Loader2, Lock, CreditCard } from "lucide-react"

type Props = {
  applicationEntryId: number
  total: number
  onSuccess: () => void
  onError: (msg: string) => void
}

export function StripePaymentForm({ applicationEntryId, total, onSuccess, onError }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const [paying, setPaying] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setPaying(true)

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    })

    if (error) {
      setPaying(false)
      onError(error.message ?? "Payment failed. Please try again.")
      return
    }

    // Verify with backend
    const verifyRes = await fetch(`/api/stripe/verify/${applicationEntryId}`)
    const verifyData = await verifyRes.json().catch(() => ({}))
    setPaying(false)

    if (!verifyRes.ok || !verifyData.ok) {
      onError(
        verifyData.message ??
          "Payment went through but assignment failed. Please contact support@workedin.ca."
      )
      return
    }

    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      <Button type="submit" size="lg" disabled={!stripe || paying} className="gap-2 w-full">
        {paying ? (
          <><Loader2 className="size-4 animate-spin" /> Processing...</>
        ) : (
          <><Lock className="size-4" /><CreditCard className="size-4" /> Pre-Authorize ${Number(total).toLocaleString("en-CA", { minimumFractionDigits: 2 })} CAD</>
        )}
      </Button>
    </form>
  )
}
