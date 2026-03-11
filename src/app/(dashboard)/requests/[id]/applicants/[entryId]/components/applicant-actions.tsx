"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCheckoutStore } from "@/store/checkoutStore"
import {
  CheckCircle2,
  X,
  Lock,
  CreditCard,
  Loader2,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

type Props = {
  entryId: number
  requestId: number
  serviceRequestId: number
  expertBid: number
  originalBudget: number | null
  budgetOption: string
  expertName: string
  expertAvatar: string
  requestTitle: string
  status: "Pending" | "Accepted" | "Rejected"
}

type PriceOption = "counter" | "original" | "custom"

export function ApplicantActions({
  entryId,
  requestId,
  serviceRequestId,
  expertBid,
  originalBudget,
  budgetOption,
  expertName,
  expertAvatar,
  requestTitle,
  status,
}: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const { setDetails } = useCheckoutStore()

  const [step, setStep] = useState<"idle" | "price" | "policy" | "rejecting">("idle")
  const [priceOption, setPriceOption] = useState<PriceOption>("counter")
  const [customPrice, setCustomPrice] = useState("")
  const [priceError, setPriceError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resolvedPrice = () => {
    if (priceOption === "counter") return expertBid
    if (priceOption === "original") return originalBudget ?? expertBid
    return parseFloat(customPrice) || 0
  }

  function handlePriceProceed() {
    setPriceError(null)
    if (priceOption === "custom") {
      const val = parseFloat(customPrice)
      if (!customPrice || isNaN(val) || val < 10) {
        setPriceError(t("applicantActions.minPrice"))
        return
      }
    }
    setStep("policy")
  }

  async function handleReject() {
    setLoading(true)
    setError(null)
    const res = await fetch(`/api/applications/entries/${entryId}/reject`, { method: "PATCH" })
    const data = await res.json().catch(() => ({}))
    setLoading(false)
    setStep("idle")
    if (!res.ok || !data.ok) {
      setError(data.message ?? t("applicantActions.rejectFailed"))
      return
    }
    router.refresh()
  }

  async function handleCheckout() {
    setLoading(true)
    setError(null)

    const finalPrice = resolvedPrice()
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ finalPrice, serviceRequestId, applicationEntryId: entryId }),
    })

    const data = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok || !data.ok) {
      setError(data.message ?? t("applicantActions.checkoutError"))
      setStep("price")
      return
    }

    setDetails({
      ...data.data,
      applicationEntryId: entryId,
      expertName,
      expertAvatar,
      requestTitle,
    })
    setStep("idle")
    router.push(`/requests/${requestId}/checkout`)
  }

  if (status === "Rejected") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <X className="size-4 text-destructive" />
        {t("applicantActions.rejected")}
      </div>
    )
  }

  if (status === "Accepted") {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
        <CheckCircle2 className="size-4" />
        {t("applicantActions.accepted")}
      </div>
    )
  }

  return (
    <>
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2 flex items-center gap-2">
          <AlertTriangle className="size-4 shrink-0" /> {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="text-destructive hover:text-destructive"
          onClick={() => setStep("rejecting")}
        >
          <X className="size-4 mr-1.5" /> {t("applicantActions.reject")}
        </Button>
        <Button onClick={() => setStep("price")}>
          <CheckCircle2 className="size-4 mr-1.5" /> {t("applicantActions.acceptContinue")}
        </Button>
      </div>

      {/* Reject confirmation */}
      <Dialog open={step === "rejecting"} onOpenChange={(o) => !o && setStep("idle")}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("applicantActions.rejectTitle")}</DialogTitle>
            <DialogDescription>
              {t("applicantActions.rejectDesc", { name: expertName })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStep("idle")}>{t("applicantActions.cancel")}</Button>
            <Button variant="destructive" onClick={handleReject} disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : t("applicantActions.reject")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Price selection */}
      <Dialog open={step === "price"} onOpenChange={(o) => !o && setStep("idle")}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("applicantActions.priceTitle")}</DialogTitle>
            <DialogDescription>
              {t("applicantActions.priceDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-2">
            {expertBid > 0 && (
              <PriceCard
                selected={priceOption === "counter"}
                onClick={() => setPriceOption("counter")}
                label={t("applicantActions.acceptCounter")}
                description={t("applicantActions.expertProposal", { amount: Number(expertBid).toLocaleString() })}
                value={`$${Number(expertBid).toLocaleString()}`}
              />
            )}

            {originalBudget != null && (
              <PriceCard
                selected={priceOption === "original"}
                onClick={() => setPriceOption("original")}
                label={t("applicantActions.originalBudget")}
                description={t("applicantActions.postedBudget", { amount: Number(originalBudget).toLocaleString() })}
                value={`$${Number(originalBudget).toLocaleString()}`}
              />
            )}

            <PriceCard
              selected={priceOption === "custom"}
              onClick={() => setPriceOption("custom")}
              label={t("applicantActions.customPrice")}
              description={t("applicantActions.customPriceDesc")}
              value={customPrice ? `$${customPrice}` : undefined}
            >
              {priceOption === "custom" && (
                <div className="mt-3">
                  <Label htmlFor="customPrice" className="text-xs">{t("applicantActions.amountLabel")}</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                    <Input
                      id="customPrice"
                      type="number"
                      min="10"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-7"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </PriceCard>

            {priceError && (
              <p className="text-xs text-destructive">{priceError}</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStep("idle")}>{t("applicantActions.cancel")}</Button>
            <Button onClick={handlePriceProceed}>{t("applicantActions.proceed")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment policy / disclaimer */}
      <Dialog open={step === "policy"} onOpenChange={(o) => !o && setStep("price")}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="size-4" /> {t("applicantActions.policyTitle")}
            </DialogTitle>
            <DialogDescription>
              {t("applicantActions.policyDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2 text-sm">
            <PolicyItem
              icon={<Lock className="size-4 text-primary" />}
              title={t("applicantActions.secureTitle")}
              body={t("applicantActions.secureBody")}
            />
            <Separator />
            <PolicyItem
              icon={<CreditCard className="size-4 text-primary" />}
              title={t("applicantActions.paymentMethodsTitle")}
              body={t("applicantActions.paymentMethodsBody")}
            />
            <Separator />
            <PolicyItem
              icon={<CheckCircle2 className="size-4 text-primary" />}
              title={t("applicantActions.preAuthTitle")}
              body={t("applicantActions.preAuthBody")}
            />
            <Separator />
            <div className="rounded-lg bg-muted px-4 py-3 text-xs text-muted-foreground">
              {t("applicantActions.finalAmountNote", { amount: Number(resolvedPrice()).toLocaleString() })}{" "}
              <a href="#" className="underline">{t("applicantActions.terms")}</a> {t("common.and")}{" "}
              <a href="#" className="underline">{t("applicantActions.privacy")}</a>.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStep("price")}>{t("applicantActions.back")}</Button>
            <Button onClick={handleCheckout} disabled={loading} className="gap-2">
              {loading
                ? <><Loader2 className="size-4 animate-spin" /> {t("applicantActions.processing")}</>
                : t("applicantActions.proceedCheckout")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function PriceCard({
  selected,
  onClick,
  label,
  description,
  value,
  children,
}: {
  selected: boolean
  onClick: () => void
  label: string
  description: string
  value?: string
  children?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border-2 px-4 py-3 text-left transition-all",
        selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-full border-2",
            selected ? "border-primary" : "border-muted-foreground/40"
          )}>
            {selected && <span className="size-2 rounded-full bg-primary" />}
          </span>
          <div>
            <p className="font-medium text-sm">{label}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        {value && <span className="font-semibold text-sm shrink-0">{value}</span>}
      </div>
      {children}
    </button>
  )
}

function PolicyItem({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground text-xs mt-0.5">{body}</p>
      </div>
    </div>
  )
}
