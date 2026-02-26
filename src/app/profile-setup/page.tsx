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

const STEPS = [
  { number: 1, label: "Personal" },
  { number: 2, label: "Account type" },
  { number: 3, label: "Expertise" },
  { number: 4, label: "Address" },
  { number: 5, label: "Payment" },
  { number: 6, label: "Photo" },
  { number: 7, label: "Review" },
]

const STEP_TITLES: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: "Personal information",
    subtitle: "Tell us a bit about yourself to get started.",
  },
  2: { title: "Account type", subtitle: "How will you be using Workedin?" },
  3: {
    title: "Expertise & skills",
    subtitle: "Help us match you with the right opportunities.",
  },
  4: {
    title: "Your address",
    subtitle: "We use this to match you with local opportunities.",
  },
  5: { title: "Payment setup", subtitle: "Secure payments for your missions." },
  6: {
    title: "Profile photo",
    subtitle: "A photo helps build trust with your connections.",
  },
  7: {
    title: "Review & confirm",
    subtitle: "Everything look right? Complete your profile.",
  },
}

export default function ProfileSetupPage() {
  const { currentStep } = useProfileSetupStore()
  const progress = (currentStep / 7) * 100
  const { title, subtitle } = STEP_TITLES[currentStep]
  const { logout } = useAuth()

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
            Step {currentStep} of 7
          </p>
          <div>
            <LogOut onClick={logout} />
          </div>
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
