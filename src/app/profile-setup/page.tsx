"use client"

import { useProfileSetupStore } from "@/store/profileSetupStore"
import { Step1Personal } from "./components/step-1-personal"
import { Step2AccountType } from "./components/step-2-account-type"
import { Step3Expertise } from "./components/step-3-expertise"
import { Step4Address } from "./components/step-4-address"
import { Step5Payment } from "./components/step-5-payment"
import { Step6Photo } from "./components/step-6-photo"
import { Step7Review } from "./components/step-7-review"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { LogOut } from "lucide-react"
import useAuth from "@/hooks/use-auth"
import { Logo } from "@/components/logo"
import { useTranslation } from "react-i18next"

export default function ProfileSetupPage() {
  const { t } = useTranslation()
  const { currentStep } = useProfileSetupStore()
  const progress = (currentStep / 7) * 100
  const { logout } = useAuth()

  const STEPS = [
    { number: 1, label: t("profileSetup.steps.personal") },
    { number: 2, label: t("profileSetup.steps.accountType") },
    { number: 3, label: t("profileSetup.steps.expertise") },
    { number: 4, label: t("profileSetup.steps.address") },
    { number: 5, label: t("profileSetup.steps.payment") },
    { number: 6, label: t("profileSetup.steps.photo") },
    { number: 7, label: t("profileSetup.steps.review") },
  ]

  const title = t(`profileSetup.stepTitles.${currentStep}.title`)
  const subtitle = t(`profileSetup.stepTitles.${currentStep}.subtitle`)

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="border-b bg-background px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
        <Logo/>
        </Link>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <p className="text-sm text-muted-foreground">
            {t("profileSetup.stepOf", { current: currentStep, total: 7 })}
          </p>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="size-4" />
            <span>{t("profileSetup.logOut")}</span>
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-border">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-1">
        {/* Step indicator (desktop sidebar) */}
        <aside className="hidden lg:flex w-64 flex-col gap-1 border-r bg-background px-4 py-8">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                currentStep === step.number &&
                  "bg-primary/10 text-primary font-medium",
                currentStep > step.number && "text-muted-foreground",
                currentStep < step.number && "text-muted-foreground/50"
              )}
            >
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs font-semibold border-2 shrink-0",
                  currentStep === step.number &&
                    "border-primary bg-primary text-primary-foreground",
                  currentStep > step.number &&
                    "border-primary bg-primary text-primary-foreground",
                  currentStep < step.number &&
                    "border-muted-foreground/30 text-muted-foreground/50"
                )}
              >
                {currentStep > step.number ? "✓" : step.number}
              </div>
              {step.label}
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex flex-1 items-start justify-center px-4 py-10">
          <div className="w-full max-w-xl space-y-8">
            {/* Step heading */}
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-muted-foreground mt-1">{subtitle}</p>
            </div>

            {/* Step component */}
            {currentStep === 1 && <Step1Personal />}
            {currentStep === 2 && <Step2AccountType />}
            {currentStep === 3 && <Step3Expertise />}
            {currentStep === 4 && <Step4Address />}
            {currentStep === 5 && <Step5Payment />}
            {currentStep === 6 && <Step6Photo />}
            {currentStep === 7 && <Step7Review />}
          </div>
        </main>
      </div>
    </div>
  )
}
