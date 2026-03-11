"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Lock,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileCheck,
  CreditCard,
  Upload,
  Camera,
  Loader2,
  RotateCcw,
  Info,
  AlertCircle,
} from "lucide-react"
import { useTranslation } from "react-i18next"

// ── Types ─────────────────────────────────────────────────────────────────────

type DocumentType = "DRIVERS_LICENSE" | "PASSPORT"
type StatusView = "loading" | "wizard" | "reviewing" | "rejected" | "approved"

interface ImageData {
  file: File
  preview: string
  base64: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(",")[1] ?? result)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function WizardProgress({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="flex items-center mb-1">
      {steps.map((label, i) => {
        const num = i + 1
        const done = num < current
        const active = num === current
        return (
          <div key={label} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {done ? <CheckCircle className="size-3.5" /> : num}
              </div>
              <span
                className={cn(
                  "text-xs font-medium hidden sm:inline",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("flex-1 h-px mx-3", done ? "bg-primary" : "bg-border")} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function ImageUploadCard({
  label,
  hint,
  capture,
  image,
  onSelect,
  required = true,
  optionalText,
  replaceText,
}: {
  label: string
  hint: string
  capture?: "environment" | "user"
  image: ImageData | null
  onSelect: (img: ImageData) => void
  required?: boolean
  optionalText: string
  replaceText: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    const base64 = await fileToBase64(file)
    onSelect({ file, preview, base64 })
  }

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
        {!required && <span className="text-muted-foreground font-normal ml-1">{optionalText}</span>}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        {...(capture ? { capture } : {})}
        className="hidden"
        onChange={handleChange}
      />
      {image ? (
        <div className="relative rounded-lg overflow-hidden border aspect-video bg-muted">
          <img src={image.preview} alt={label} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-black/80"
          >
            <RotateCcw className="size-3" />
            {replaceText}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center hover:border-primary/50 hover:bg-muted/30 transition-colors"
        >
          <Upload className="size-6 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{hint}</span>
        </button>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function AccountStatusClient({
  accountStatus,
}: {
  accountStatus: string | null
}) {
  const router = useRouter()
  const { t } = useTranslation()

  const WIZARD_STEPS = [
    t("account.status.wizard.stepDocument"),
    t("account.status.wizard.stepUpload"),
    t("account.status.wizard.stepSelfie"),
    t("account.status.wizard.stepReview"),
  ]

  const [view, setView] = useState<StatusView>("loading")
  const [step, setStep] = useState(1)
  const [rejectionReason, setRejectionReason] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [starting, setStarting] = useState(false)

  const [documentType, setDocumentType] = useState<DocumentType | null>(null)
  const [frontImage, setFrontImage] = useState<ImageData | null>(null)
  const [backImage, setBackImage] = useState<ImageData | null>(null)
  const [selfieImage, setSelfieImage] = useState<ImageData | null>(null)

  useEffect(() => {
    const isVerified = accountStatus === "VERIFIED" || accountStatus === "ACTIVE"
    if (isVerified) {
      setView("approved")
      return
    }
    fetch("/api/identity-verification")
      .then((r) => r.json())
      .then((data) => {
        const status = data.status as string | undefined
        if (status === "REVIEWING") setView("reviewing")
        else if (status === "REJECTED") {
          setRejectionReason(data.rejectionReason ?? null)
          setView("rejected")
        } else if (status === "APPROVED") setView("approved")
        else setView("wizard")
      })
      .catch(() => setView("wizard"))
  }, [accountStatus])

  async function handleDocumentContinue() {
    if (!documentType) return
    setStarting(true)
    setError(null)
    try {
      const res = await fetch("/api/identity-verification/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentType }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError((d as { message?: string }).message ?? t("account.status.wizard.step3.startFailed"))
        return
      }
      setStep(4)
    } catch {
      setError(t("account.status.wizard.somethingWentWrong"))
    } finally {
      setStarting(false)
    }
  }

  async function handleSubmit() {
    if (!frontImage || !selfieImage || !documentType) return
    if (documentType === "DRIVERS_LICENSE" && !backImage) {
      setError(t("account.status.wizard.step4.backRequired"))
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/identity-verification/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType,
          documentFrontImage: { base64: frontImage.base64 },
          documentBackImage: backImage ? { base64: backImage.base64 } : null,
          selfieImage: { base64: selfieImage.base64 },
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError((d as { message?: string }).message ?? t("account.status.wizard.step6.submissionFailed"))
        return
      }
      setView("reviewing")
    } catch {
      setError(t("account.status.wizard.somethingWentWrong"))
    } finally {
      setSubmitting(false)
    }
  }

  function handleRetry() {
    setDocumentType(null)
    setFrontImage(null)
    setBackImage(null)
    setSelfieImage(null)
    setRejectionReason(null)
    setError(null)
    setStep(1)
    setView("wizard")
  }

  if (view === "loading") {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // ── Shared page header ────────────────────────────────────────────────────

  const isWizard = view === "wizard"

  const pageHeader = (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="-ml-2"
        onClick={() => {
          if (isWizard && step > 1) setStep((s) => s - 1)
          else router.push("/account")
        }}
      >
        <ArrowLeft className="size-4" />
      </Button>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("account.status.title")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {isWizard ? t("account.status.identityVerification") : t("account.status.subtitle")}
        </p>
      </div>
    </div>
  )

  // ── Approved ──────────────────────────────────────────────────────────────

  if (view === "approved") {
    return (
      <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-2xl">
        {pageHeader}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/40 shrink-0">
                <CheckCircle className="size-4 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-base">{t("account.status.approved.title")}</CardTitle>
                <CardDescription>{t("account.status.approved.desc")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-start gap-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-4 py-3">
              <ShieldCheck className="size-4 text-emerald-600 mt-0.5 shrink-0" />
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                {t("account.status.approved.notice")}
              </p>
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button variant="outline" asChild>
                <Link href="/account">{t("common.backToAccount")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Reviewing ─────────────────────────────────────────────────────────────

  if (view === "reviewing") {
    return (
      <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-2xl">
        {pageHeader}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/40 shrink-0">
                <Clock className="size-4 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-base">{t("account.status.reviewing.title")}</CardTitle>
                <CardDescription>{t("account.status.reviewing.desc")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-0">
              {[
                {
                  icon: CheckCircle,
                  color: "text-emerald-600",
                  bg: "bg-emerald-100 dark:bg-emerald-950/40",
                  title: t("account.status.reviewing.step1Title"),
                  desc: t("account.status.reviewing.step1Desc"),
                  badge: t("account.status.reviewing.step1Badge"),
                  variant: "outline" as const,
                },
                {
                  icon: Clock,
                  color: "text-amber-600",
                  bg: "bg-amber-100 dark:bg-amber-950/40",
                  title: t("account.status.reviewing.step2Title"),
                  desc: t("account.status.reviewing.step2Desc"),
                  badge: t("account.status.reviewing.step2Badge"),
                  variant: "default" as const,
                },
                {
                  icon: CheckCircle,
                  color: "text-muted-foreground",
                  bg: "bg-muted",
                  title: t("account.status.reviewing.step3Title"),
                  desc: t("account.status.reviewing.step3Desc"),
                  badge: t("account.status.reviewing.step3Badge"),
                  variant: "secondary" as const,
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={cn("flex size-8 items-center justify-center rounded-full shrink-0", item.bg)}>
                      <item.icon className={cn("size-4", item.color)} />
                    </div>
                    {i < 2 && <div className="w-px flex-1 bg-border my-1" />}
                  </div>
                  <div className="pb-5 pt-0.5 flex-1 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Badge variant={item.variant} className="shrink-0 text-xs">{item.badge}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                {t("nav.dashboard")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Rejected ──────────────────────────────────────────────────────────────

  if (view === "rejected") {
    return (
      <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-2xl">
        {pageHeader}
        <Card className="border-destructive/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950/40 shrink-0">
                <XCircle className="size-4 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-base">{t("account.status.rejected.title")}</CardTitle>
                <CardDescription>
                  {t("account.status.rejected.desc")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {rejectionReason && (
              <div className="flex items-start gap-3 rounded-lg bg-destructive/5 border border-destructive/20 px-4 py-3">
                <AlertCircle className="size-4 text-destructive mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-destructive mb-0.5">{t("common.reason")}</p>
                  <p className="text-sm text-foreground">{rejectionReason}</p>
                </div>
              </div>
            )}
            <div>
              <p className="text-sm font-medium mb-3">{t("account.status.rejected.tips")}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  t("account.status.rejected.tip1"),
                  t("account.status.rejected.tip2"),
                  t("account.status.rejected.tip3"),
                  t("account.status.rejected.tip4"),
                  t("account.status.rejected.tip5"),
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="size-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <Separator />
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                {t("common.doItLater")}
              </Button>
              <Button className="gap-2" onClick={handleRetry}>
                <RotateCcw className="size-4" />
                {t("common.tryAgain")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Wizard ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-2xl">
      {pageHeader}

      {/* ── Step 1 — Intro ─────────────────────────────────── */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <ShieldCheck className="size-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">{t("account.status.wizard.step1.title")}</CardTitle>
                <CardDescription>{t("account.status.wizard.step1.desc")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: CheckCircle, label: t("account.status.wizard.step1.benefit1"), color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-950/40" },
                { icon: CreditCard, label: t("account.status.wizard.step1.benefit2"), color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-950/40" },
                { icon: ShieldCheck, label: t("account.status.wizard.step1.benefit3"), color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-950/40" },
                { icon: Lock, label: t("account.status.wizard.step1.benefit4"), color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-950/40" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-3 rounded-lg border px-4 py-3">
                  <div className={cn("flex size-8 items-center justify-center rounded-md shrink-0", b.bg)}>
                    <b.icon className={cn("size-4", b.color)} />
                  </div>
                  <p className="text-sm font-medium">{b.label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-muted/60 px-4 py-3">
              <Info className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                {t("account.status.wizard.step1.infoText")}
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" asChild>
                <Link href="/account">{t("common.cancel")}</Link>
              </Button>
              <Button className="gap-2" onClick={() => setStep(2)}>
                {t("account.status.wizard.step1.getStarted")}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Step 2 — Why Verify ────────────────────────────── */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("account.status.wizard.step2.title")}</CardTitle>
            <CardDescription>{t("account.status.wizard.step2.desc")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {[
                {
                  icon: ShieldCheck,
                  color: "text-blue-600",
                  bg: "bg-blue-100 dark:bg-blue-950/40",
                  title: t("account.status.wizard.step2.reason1Title"),
                  desc: t("account.status.wizard.step2.reason1Desc"),
                },
                {
                  icon: Lock,
                  color: "text-emerald-600",
                  bg: "bg-emerald-100 dark:bg-emerald-950/40",
                  title: t("account.status.wizard.step2.reason2Title"),
                  desc: t("account.status.wizard.step2.reason2Desc"),
                },
                {
                  icon: FileCheck,
                  color: "text-amber-600",
                  bg: "bg-amber-100 dark:bg-amber-950/40",
                  title: t("account.status.wizard.step2.reason3Title"),
                  desc: t("account.status.wizard.step2.reason3Desc"),
                },
                {
                  icon: Users,
                  color: "text-purple-600",
                  bg: "bg-purple-100 dark:bg-purple-950/40",
                  title: t("account.status.wizard.step2.reason4Title"),
                  desc: t("account.status.wizard.step2.reason4Desc"),
                },
              ].map((r) => (
                <div key={r.title} className="flex items-start gap-4 rounded-lg border px-4 py-3">
                  <div className={cn("flex size-9 items-center justify-center rounded-lg shrink-0", r.bg)}>
                    <r.icon className={cn("size-4", r.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-muted/60 px-4 py-3">
              <Lock className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                {t("account.status.wizard.step2.privacyNote")}
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                {t("common.back")}
              </Button>
              <Button className="gap-2" onClick={() => setStep(3)}>
                {t("common.continue")}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Step 3 — Select Document ───────────────────────── */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <WizardProgress current={1} steps={WIZARD_STEPS} />
            <CardTitle className="text-base">{t("account.status.wizard.step3.title")}</CardTitle>
            <CardDescription>
              {t("account.status.wizard.step3.desc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  {
                    type: "DRIVERS_LICENSE" as const,
                    icon: CreditCard,
                    title: t("account.status.wizard.step3.driversLicenseTitle"),
                    desc: t("account.status.wizard.step3.driversLicenseDesc"),
                    reqs: [
                      t("account.status.wizard.step3.req1"),
                      t("account.status.wizard.step3.req2"),
                    ],
                  },
                  {
                    type: "PASSPORT" as const,
                    icon: FileCheck,
                    title: t("account.status.wizard.step3.passportTitle"),
                    desc: t("account.status.wizard.step3.passportDesc"),
                    reqs: [
                      t("account.status.wizard.step3.req1"),
                      t("account.status.wizard.step3.passportReq2"),
                    ],
                  },
                ] as const
              ).map((doc) => {
                const selected = documentType === doc.type
                return (
                  <button
                    key={doc.type}
                    type="button"
                    onClick={() => setDocumentType(doc.type)}
                    className={cn(
                      "flex flex-col gap-3 rounded-lg border-2 p-4 text-left transition-all",
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          "flex size-9 items-center justify-center rounded-lg",
                          selected ? "bg-primary/15" : "bg-muted"
                        )}
                      >
                        <doc.icon
                          className={cn("size-4", selected ? "text-primary" : "text-muted-foreground")}
                        />
                      </div>
                      {selected && <CheckCircle className="size-4 text-primary" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{doc.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{doc.desc}</p>
                    </div>
                    <ul className="flex flex-col gap-1">
                      {doc.reqs.map((req) => (
                        <li key={req} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CheckCircle className="size-3 text-emerald-600 shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </button>
                )
              })}
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2">
                <AlertCircle className="size-4 text-destructive shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Separator />
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                {t("common.back")}
              </Button>
              <Button
                className="gap-2"
                disabled={!documentType || starting}
                onClick={handleDocumentContinue}
              >
                {starting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t("account.status.wizard.step3.starting")}
                  </>
                ) : (
                  <>
                    {t("common.continue")}
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Step 4 — Upload Document ───────────────────────── */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <WizardProgress current={2} steps={WIZARD_STEPS} />
            <CardTitle className="text-base">{t("account.status.wizard.step4.title")}</CardTitle>
            <CardDescription>
              {documentType === "DRIVERS_LICENSE"
                ? t("account.status.wizard.step4.licenseDesc")
                : t("account.status.wizard.step4.passportDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div
              className={cn(
                "grid gap-4",
                documentType === "DRIVERS_LICENSE" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 max-w-xs"
              )}
            >
              <ImageUploadCard
                label={t("account.status.wizard.step4.front")}
                hint={t("account.status.wizard.step4.frontHint")}
                image={frontImage}
                onSelect={setFrontImage}
                optionalText={t("common.optional")}
                replaceText={t("common.replace")}
              />
              {documentType === "DRIVERS_LICENSE" && (
                <ImageUploadCard
                  label={t("account.status.wizard.step4.back")}
                  hint={t("account.status.wizard.step4.backHint")}
                  image={backImage}
                  onSelect={setBackImage}
                  optionalText={t("common.optional")}
                  replaceText={t("common.replace")}
                />
              )}
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-muted/60 px-4 py-3">
              <Info className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                {t("account.status.wizard.step4.infoNote")}
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setStep(3)}>
                {t("common.back")}
              </Button>
              <Button
                className="gap-2"
                disabled={!frontImage || (documentType === "DRIVERS_LICENSE" && !backImage)}
                onClick={() => setStep(5)}
              >
                {t("common.continue")}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Step 5 — Selfie ───────────────────────────────── */}
      {step === 5 && (
        <Card>
          <CardHeader>
            <WizardProgress current={3} steps={WIZARD_STEPS} />
            <CardTitle className="text-base">{t("account.status.wizard.step5.title")}</CardTitle>
            <CardDescription>
              {t("account.status.wizard.step5.desc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="max-w-xs">
              <ImageUploadCard
                label={t("account.status.wizard.step5.selfieLabel")}
                hint={t("account.status.wizard.step5.selfieHint")}
                capture="user"
                image={selfieImage}
                onSelect={setSelfieImage}
                optionalText={t("common.optional")}
                replaceText={t("common.replace")}
              />
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-muted/60 px-4 py-3">
              <Camera className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                {t("account.status.wizard.step5.cameraNote")}
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setStep(4)}>
                {t("common.back")}
              </Button>
              <Button className="gap-2" disabled={!selfieImage} onClick={() => setStep(6)}>
                {t("common.continue")}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Step 6 — Review & Submit ──────────────────────── */}
      {step === 6 && (
        <Card>
          <CardHeader>
            <WizardProgress current={4} steps={WIZARD_STEPS} />
            <CardTitle className="text-base">{t("account.status.wizard.step6.title")}</CardTitle>
            <CardDescription>
              {t("account.status.wizard.step6.desc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* Document type row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted shrink-0">
                  <CreditCard className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("account.status.wizard.step6.documentTypeLabel")}</p>
                  <p className="text-sm font-medium">
                    {documentType === "DRIVERS_LICENSE"
                      ? t("account.status.wizard.step3.driversLicenseTitle")
                      : t("account.status.wizard.step3.passportTitle")}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary h-auto py-1 text-xs"
                onClick={() => setStep(3)}
              >
                {t("account.status.wizard.step6.change")}
              </Button>
            </div>
            <Separator />

            {/* Uploaded photos */}
            <div>
              <p className="text-sm font-medium mb-3">{t("account.status.wizard.step6.uploadedPhotos")}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {frontImage && (
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-muted-foreground font-medium">{t("account.status.wizard.step4.front")}</p>
                    <img
                      src={frontImage.preview}
                      alt={t("account.status.wizard.step4.front")}
                      className="w-full aspect-video rounded-lg object-cover border"
                    />
                  </div>
                )}
                {backImage && (
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-muted-foreground font-medium">{t("account.status.wizard.step4.back")}</p>
                    <img
                      src={backImage.preview}
                      alt={t("account.status.wizard.step4.back")}
                      className="w-full aspect-video rounded-lg object-cover border"
                    />
                  </div>
                )}
                {selfieImage && (
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-muted-foreground font-medium">{t("account.status.wizard.step5.selfieLabel")}</p>
                    <img
                      src={selfieImage.preview}
                      alt={t("account.status.wizard.step5.selfieLabel")}
                      className="w-full aspect-video rounded-lg object-cover border"
                    />
                  </div>
                )}
              </div>
            </div>
            <Separator />

            {/* Disclaimer */}
            <div className="flex items-start gap-3 rounded-lg bg-muted/60 px-4 py-3">
              <Info className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                {t("account.status.wizard.step6.disclaimer")}
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2">
                <AlertCircle className="size-4 text-destructive shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setStep(5)}>
                {t("common.back")}
              </Button>
              <Button className="gap-2" disabled={submitting} onClick={handleSubmit}>
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t("account.status.wizard.step6.submitting")}
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-4" />
                    {t("account.status.wizard.step6.submitForReview")}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
