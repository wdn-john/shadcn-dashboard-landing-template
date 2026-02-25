"use client"

import { Button } from "@/components/ui/button"
import { useProfileSetupStore } from "@/store/profileSetupStore"
import { CreditCard, ExternalLink, Info } from "lucide-react"

export function Step5Payment() {
  const { accountType, setPayment, nextStep, prevStep } = useProfileSetupStore()
  const isExpert = accountType === "expert"

  function handleSkip() {
    setPayment({ skipped: true })
    nextStep()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CreditCard className="size-5" />
          </div>
          <div>
            <p className="font-semibold">
              {isExpert ? "Connect your Stripe account" : "Add a payment method"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isExpert
                ? "Required to receive payouts when clients approve your work"
                : "Securely pay for missions through Workedin's protected checkout"}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-muted px-4 py-3 flex gap-2 text-sm text-muted-foreground">
          <Info className="size-4 mt-0.5 shrink-0" />
          <p>
            {isExpert
              ? "Stripe Connect integration will be available soon. You can skip this step for now and connect your account later from your profile settings."
              : "Stripe payment integration will be available soon. You can skip this step for now and add a payment method later from your settings."}
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={handleSkip}>Skip for now</Button>
          <Button disabled className="gap-2">
            <ExternalLink className="size-4" />
            {isExpert ? "Connect Stripe" : "Add Card"}
          </Button>
        </div>
      </div>
    </div>
  )
}
