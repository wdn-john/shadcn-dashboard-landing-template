"use client"

import { Button } from "@/components/ui/button"
import { useProfileSetupStore, AccountType } from "@/store/profileSetupStore"
import { cn } from "@/lib/utils"
import { Briefcase, Building2 } from "lucide-react"

const options: { value: AccountType; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: "client",
    label: "Client",
    description: "I'm a business or organization looking to hire verified IT experts for my projects.",
    icon: <Building2 className="size-8" />,
  },
  {
    value: "expert",
    label: "Expert",
    description: "I'm a verified IT professional ready to take on client missions and grow my career.",
    icon: <Briefcase className="size-8" />,
  },
]

export function Step2AccountType() {
  const { accountType, setAccountType, nextStep, prevStep } = useProfileSetupStore()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setAccountType(opt.value)}
            className={cn(
              "flex flex-col items-start gap-3 rounded-xl border-2 p-6 text-left transition-all hover:border-primary hover:bg-primary/5",
              accountType === opt.value
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
            )}
          >
            <div className={cn("text-muted-foreground", accountType === opt.value && "text-primary")}>
              {opt.icon}
            </div>
            <div>
              <p className="font-semibold text-base">{opt.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{opt.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep} disabled={!accountType}>Continue</Button>
      </div>
    </div>
  )
}
