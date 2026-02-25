"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useProfileSetupStore } from "@/store/profileSetupStore"
import { useRouter } from "next/navigation"
import { CheckCircle2, Loader2 } from "lucide-react"

export function Step7Review() {
  const router = useRouter()
  const { personal, accountType, expertise, identity, payment, avatar, prevStep, reset } = useProfileSetupStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initials = [personal.firstName[0], personal.lastName[0]].filter(Boolean).join("").toUpperCase() || "?"

  async function handleSubmit() {
    setLoading(true)
    setError(null)

    const payload = {
      personal: {
        firstName: personal.firstName,
        lastName: personal.lastName,
        preferredName: personal.preferredName || undefined,
        phone: personal.phone,
        language: personal.language,
        accountType,
        title: personal.title,
        organizationName: personal.organizationName || undefined,
        organizationEmployees: personal.organizationEmployees
          ? parseInt(personal.organizationEmployees, 10)
          : undefined,
      },
      expertise: {
        category: expertise.category || undefined,
        skills: expertise.skills.length > 0 ? expertise.skills : undefined,
        certifications: expertise.certifications.length > 0 ? expertise.certifications : undefined,
        profession: expertise.profession || undefined,
        frequentlyUsedSoftwares: expertise.frequentlyUsedSoftwares.length > 0 ? expertise.frequentlyUsedSoftwares : undefined,
        experienceLevel: expertise.experienceLevel || undefined,
        yearsExperience: expertise.yearsExperience || undefined,
        hourlyRate: expertise.hourlyRate ? parseFloat(expertise.hourlyRate) : undefined,
      },
      identity: {
        streetAddress: identity.streetAddress,
        city: identity.city,
        postalCode: identity.postalCode,
        province: identity.province,
        dateOfBirth: personal.dateOfBirth,
      },
      avatar: avatar.base64
        ? { base64: avatar.base64, filename: avatar.filename, mimeType: avatar.mimeType }
        : undefined,
      payment: payment.skipped
        ? { mode: "skipped" }
        : undefined,
    }

    try {
      const res = await fetch("/api/profile/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data.ok) {
        setError(data.message ?? "Profile setup failed. Please try again.")
        setLoading(false)
        return
      }

      reset()
      router.replace("/dashboard")
    } catch {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Avatar + Name */}
      <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
        <Avatar className="size-16">
          <AvatarImage src={avatar.previewUrl} />
          <AvatarFallback className="text-xl">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-lg">
            {personal.firstName} {personal.lastName}
          </p>
          <p className="text-sm text-muted-foreground">{personal.title}</p>
          <Badge variant="outline" className="mt-1 capitalize">{accountType}</Badge>
        </div>
      </div>

      {/* Personal */}
      <Section title="Personal Information">
        <Row label="Date of birth" value={personal.dateOfBirth} />
        <Row label="Phone" value={personal.phone} />
        <Row label="Language" value={personal.language === "en" ? "English" : "French"} />
        {personal.organizationName && <Row label="Organization" value={`${personal.organizationName}${personal.organizationEmployees ? ` (${personal.organizationEmployees} employees)` : ""}`} />}
      </Section>

      <Separator />

      {/* Address */}
      <Section title="Address">
        <Row label="Street" value={identity.streetAddress} />
        <Row label="City" value={identity.city} />
        <Row label="Province" value={identity.province} />
        <Row label="Postal code" value={identity.postalCode} />
      </Section>

      {/* Expertise (expert only) */}
      {accountType === "expert" && (
        <>
          <Separator />
          <Section title="Expertise">
            <Row label="Profession" value={expertise.profession} />
            <Row label="Category" value={expertise.category} />
            <Row label="Experience" value={`${expertise.experienceLevel} · ${expertise.yearsExperience} yr${expertise.yearsExperience !== 1 ? "s" : ""}`} />
            {expertise.hourlyRate && <Row label="Hourly rate" value={`$${expertise.hourlyRate} CAD/hr`} />}
            {expertise.skills.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {expertise.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
                </div>
              </div>
            )}
            {expertise.certifications.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Certifications</p>
                <div className="flex flex-wrap gap-1">
                  {expertise.certifications.map((c) => <Badge key={c} variant="outline">{c}</Badge>)}
                </div>
              </div>
            )}
          </Section>
        </>
      )}

      {expertise.frequentlyUsedSoftwares.length > 0 && (
        <>
          <Separator />
          <Section title="Tools & Software">
            <div className="flex flex-wrap gap-1">
              {expertise.frequentlyUsedSoftwares.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </Section>
        </>
      )}

      {/* Payment */}
      <Separator />
      <Section title="Payment">
        <p className="text-sm text-muted-foreground">
          {payment.skipped ? "Skipped — can be set up later in settings." : "Connected"}
        </p>
      </Section>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">{error}</p>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={prevStep} disabled={loading}>Back</Button>
        <Button onClick={handleSubmit} disabled={loading} className="gap-2 min-w-36">
          {loading ? (
            <><Loader2 className="size-4 animate-spin" /> Completing setup...</>
          ) : (
            <><CheckCircle2 className="size-4" /> Complete setup</>
          )}
        </Button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
