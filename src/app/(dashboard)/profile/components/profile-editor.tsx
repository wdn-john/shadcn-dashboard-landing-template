"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

export type ProfileDTO = {
  id: string
  fullName?: string
  firstName?: string
  lastName?: string
  title?: string
  businessName?: string
  industry?: string
  phoneNumber?: string
  avatarUrl?: string
  isTaxRegistered?: boolean
  tvqNumber?: string
  tpsNumber?: string
  address?: {
    street?: string
    city?: string
    region?: string
    postalCode?: string
    country?: string
    lat?: number
    lng?: number
  }
}

type Props = {
  profile: ProfileDTO | null
}

export function ProfileEditor({ profile }: Props) {
  const [fullName, setFullName]         = useState(profile?.fullName ?? "")
  const [title, setTitle]               = useState(profile?.title ?? "")
  const [phoneNumber, setPhoneNumber]   = useState(profile?.phoneNumber ?? "")
  const [industry, setIndustry]         = useState(profile?.industry ?? "")
  const [businessName, setBusinessName] = useState(profile?.businessName ?? "")
  const [street, setStreet]             = useState(profile?.address?.street ?? "")
  const [city, setCity]                 = useState(profile?.address?.city ?? "")
  const [region, setRegion]             = useState(profile?.address?.region ?? "")
  const [postalCode, setPostalCode]     = useState(profile?.address?.postalCode ?? "")
  const [country, setCountry]           = useState(profile?.address?.country ?? "")
  const [isTaxRegistered, setIsTaxRegistered] = useState(profile?.isTaxRegistered ?? false)
  const [tvqNumber, setTvqNumber]       = useState(profile?.tvqNumber ?? "")
  const [tpsNumber, setTpsNumber]       = useState(profile?.tpsNumber ?? "")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatarUrl ?? null)
  const [avatarBase64, setAvatarBase64]   = useState<string | null>(null)
  const [saving, setSaving]             = useState(false)
  const { t } = useTranslation()

  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setAvatarPreview(result)
      // Strip the data URL prefix to get raw base64
      setAvatarBase64(result.split(",")[1] ?? result)
    }
    reader.readAsDataURL(file)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        fullName: fullName || undefined,
        title: title || undefined,
        phoneNumber: phoneNumber || undefined,
        industry: industry || undefined,
        businessName: businessName || undefined,
        isTaxRegistered,
        tvqNumber: isTaxRegistered ? tvqNumber : "",
        tpsNumber: isTaxRegistered ? tpsNumber : "",
      }

      const hasAddress = street || city || region || postalCode || country
      if (hasAddress) {
        body.address = { street, city, region, postalCode, country }
      }

      if (avatarBase64) {
        body.avatar = { base64Image: avatarBase64 }
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error()
      toast.success(t("profile.saveSuccess"))
      setAvatarBase64(null)
    } catch {
      toast.error(t("profile.saveFailed"))
    } finally {
      setSaving(false)
    }
  }

  const initials = (profile?.firstName?.[0] ?? "") + (profile?.lastName?.[0] ?? "")

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("profile.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("profile.subtitle")}</p>
      </div>

      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("profile.photo")}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-5">
          <div className="relative">
            <Avatar className="size-20">
              <AvatarImage src={avatarPreview ?? undefined} alt={fullName} />
              <AvatarFallback className="text-lg">{initials || "?"}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground p-1.5 shadow-sm hover:bg-primary/90 transition-colors"
            >
              <Camera className="size-3.5" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium">{fullName || t("profile.yourName")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{title || t("profile.noTitle")}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => fileInputRef.current?.click()}
            >
              {t("profile.changePhoto")}
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("profile.personalInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 grid gap-1.5">
            <Label htmlFor="fullName">{t("profile.fullName")}</Label>
            <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="title">{t("profile.professionalTitle")}</Label>
            <Input id="title" placeholder="e.g. Senior IT Consultant" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="phone">{t("profile.phoneNumber")}</Label>
            <Input id="phone" placeholder="+1 (555) 000-0000" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Professional Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("profile.professionalInfo")}</CardTitle>
          <CardDescription>{t("profile.professionalInfoHint")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="industry">{t("profile.industry")}</Label>
            <Input id="industry" placeholder="e.g. Information Technology" value={industry} onChange={e => setIndustry(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="businessName">{t("profile.businessName")}</Label>
            <Input id="businessName" placeholder={t("common.optional")} value={businessName} onChange={e => setBusinessName(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("profile.address")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 grid gap-1.5">
            <Label htmlFor="street">{t("profile.street")}</Label>
            <Input id="street" value={street} onChange={e => setStreet(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="city">{t("common.city")}</Label>
            <Input id="city" value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="region">{t("profile.region")}</Label>
            <Input id="region" value={region} onChange={e => setRegion(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="postalCode">{t("common.postalCode")}</Label>
            <Input id="postalCode" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="country">{t("common.country")}</Label>
            <Input id="country" value={country} onChange={e => setCountry(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Tax Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("profile.taxInfo")}</CardTitle>
          <CardDescription>{t("profile.taxInfoDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="taxRegistered">{t("profile.taxRegistered")}</Label>
            <Switch
              id="taxRegistered"
              checked={isTaxRegistered}
              onCheckedChange={setIsTaxRegistered}
            />
          </div>
          {isTaxRegistered && (
            <>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="tpsNumber">{t("profile.tpsNumber")}</Label>
                  <Input id="tpsNumber" value={tpsNumber} onChange={e => setTpsNumber(e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="tvqNumber">{t("profile.tvqNumber")}</Label>
                  <Input id="tvqNumber" value={tvqNumber} onChange={e => setTvqNumber(e.target.value)} />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end pb-8">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
          {t("profile.saveChanges")}
        </Button>
      </div>
    </div>
  )
}
