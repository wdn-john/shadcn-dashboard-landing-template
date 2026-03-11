"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

// ── Issue suggestions (mirrors mobile backupItHelpDeskCommonIssues) ────────────

const ISSUE_SUGGESTIONS = [
  "Password reset", "Software installation", "Network connectivity issues",
  "Printer not working", "Email issues", "Computer running slow",
  "Virus or malware", "File recovery", "VPN issues", "Hardware failure",
  "Account lockout", "Software update", "Data backup", "Remote access issues",
  "Blue screen of death", "Software crash", "Peripheral device issues",
  "Security alert", "Access permissions", "System performance",
  "Software compatibility issues", "Email configuration", "Mobile device support",
  "Cloud service issues", "Database issues", "User training",
  "Software licensing", "Server maintenance", "Password policy",
  "Two-factor authentication", "Firewall issues", "Network security",
  "Data encryption", "Software deployment", "System monitoring",
  "Patch management", "Incident response", "Compliance issues",
  "User account management", "System integration", "Application support",
  "Hardware upgrades", "Virtualization issues", "Backup and restore",
  "Performance tuning", "Log management", "Capacity planning",
  "Disaster recovery", "Service desk management", "IT asset management",
  "Change management", "Other",
]

const PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
]

// ── Component ─────────────────────────────────────────────────────────────────

export function PostRequestForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Issue suggestions state
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestionQuery, setSuggestionQuery] = useState("")
  const issueContainerRef = useRef<HTMLDivElement>(null)

  const filteredSuggestions = suggestionQuery.trim()
    ? ISSUE_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(suggestionQuery.toLowerCase())
      )
    : ISSUE_SUGGESTIONS

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (issueContainerRef.current && !issueContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // ── Schema (inside component to use t()) ─────────────────────────────────────

  const schema = z
    .object({
      issue: z.string().min(5, t("requests.new.issueTitleError")),
      category: z.enum(
        ["SOFTWARE", "HARDWARE", "NETWORK", "SECURITY", "PROJECT", "OTHER"],
        { message: t("requests.new.category") }
      ),
      description: z.string().min(20, t("requests.new.descriptionError")),
      priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
        message: t("requests.new.priority"),
      }),
      workLocation: z.enum(["ON_SITE", "REMOTE", "NOT_SURE"], {
        message: t("requests.new.workLocation"),
      }),
      budgetOption: z.enum(["NEGOTIABLE", "FIXED"], {
        message: t("requests.new.budget"),
      }),
      budget: z.string().optional(),
      desiredCompletionDate: z.string().min(1, t("requests.new.completionDate")),
      street: z.string().optional(),
      city: z.string().optional(),
      province: z.string().optional(),
      postalCode: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.budgetOption === "FIXED" && !data.budget) {
        ctx.addIssue({
          code: "custom",
          path: ["budget"],
          message: t("requests.new.budgetAmount"),
        })
      }
      if (data.workLocation !== "REMOTE") {
        if (!data.city)
          ctx.addIssue({
            code: "custom",
            path: ["city"],
            message: t("requests.new.cityPlaceholder"),
          })
      }
    })

  type FormValues = z.infer<typeof schema>

  // ── Category/Enum labels ────────────────────────────────────────────────────

  const CATEGORIES = [
    { value: "SOFTWARE", label: t("requests.new.categories.SOFTWARE") },
    { value: "HARDWARE", label: t("requests.new.categories.HARDWARE") },
    { value: "NETWORK", label: t("requests.new.categories.NETWORK") },
    { value: "SECURITY", label: t("requests.new.categories.SECURITY") },
    { value: "PROJECT", label: t("requests.new.categories.PROJECT") },
    { value: "OTHER", label: t("requests.new.categories.OTHER") },
  ]

  const PRIORITIES = [
    { value: "LOW", label: t("requests.new.priorities.LOW"), desc: t("requests.new.priorities.lowHint") },
    { value: "MEDIUM", label: t("requests.new.priorities.MEDIUM"), desc: t("requests.new.priorities.mediumHint") },
    { value: "HIGH", label: t("requests.new.priorities.HIGH"), desc: t("requests.new.priorities.highHint") },
  ]

  const WORK_LOCATIONS = [
    { value: "REMOTE", label: t("requests.new.workLocations.REMOTE"), desc: t("requests.new.workLocations.remoteHint") },
    { value: "ON_SITE", label: t("requests.new.workLocations.ON_SITE"), desc: t("requests.new.workLocations.onsiteHint") },
    { value: "NOT_SURE", label: t("requests.new.workLocations.NOT_SURE"), desc: t("requests.new.workLocations.notsureHint") },
  ]

  const BUDGET_OPTIONS = [
    { value: "NEGOTIABLE", label: t("requests.new.budgetOptions.NEGOTIABLE"), desc: t("requests.new.budgetOptions.negotiableHint") },
    { value: "FIXED", label: t("requests.new.budgetOptions.FIXED"), desc: t("requests.new.budgetOptions.fixedHint") },
  ]

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      priority: "MEDIUM",
      workLocation: "NOT_SURE",
      budgetOption: "NEGOTIABLE",
    },
  })

  const budgetOption = watch("budgetOption")
  const workLocation = watch("workLocation")
  const showAddressFields = workLocation !== "REMOTE"

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    setError(null)

    const addressObj = showAddressFields
      ? {
          street: values.street ?? "",
          city: values.city ?? "",
          region: values.province ?? "",
          postalCode: values.postalCode ?? "",
          country: "Canada",
          lat: 0,
          lng: 0,
        }
      : { lat: 0, lng: 0, country: "Canada" }

    const formData = new FormData()
    formData.append("issue", values.issue)
    formData.append("category", values.category)
    formData.append("description", values.description)
    formData.append("priority", values.priority)
    formData.append("workLocation", values.workLocation)
    formData.append("budgetOption", values.budgetOption)
    formData.append("address", JSON.stringify(addressObj))
    formData.append(
      "desiredCompletionDate",
      new Date(values.desiredCompletionDate).toISOString()
    )
    if (values.budget) {
      formData.append("budget", values.budget)
    }

    const res = await fetch("/api/service-requests", {
      method: "POST",
      body: formData,
    })

    const data = await res.json().catch(() => ({}))
    setSubmitting(false)

    if (!res.ok || !data.ok) {
      setError(data.message ?? t("requests.new.failed"))
      return
    }

    const id = data.data?.id
    router.replace(id ? `/requests/${id}` : "/requests")
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-3xl">
      {/* Back link */}
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
          <Link
            href="/requests"
            className="flex items-center gap-1 text-muted-foreground"
          >
            <ArrowLeft className="size-3" /> {t("requests.backToRequests")}
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {t("requests.new.title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("requests.new.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* ── Section 1: The Problem ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("requests.new.issueSection")}</CardTitle>
            <CardDescription>
              {t("requests.new.issueSectionHint")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-2" ref={issueContainerRef}>
              <Label htmlFor="issue">
                {t("requests.new.issueTitle")}
              </Label>
              <div className="relative">
                <Input
                  id="issue"
                  placeholder={t("requests.new.issueTitlePlaceholder")}
                  autoComplete="off"
                  {...register("issue")}
                  onChange={(e) => {
                    register("issue").onChange(e)
                    setSuggestionQuery(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover shadow-md">
                    {filteredSuggestions.map((suggestion) => (
                      <li
                        key={suggestion}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          setValue("issue", suggestion, { shouldValidate: true })
                          setSuggestionQuery(suggestion)
                          setShowSuggestions(false)
                        }}
                        className={cn(
                          "cursor-pointer px-3 py-2 text-sm",
                          "hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {errors.issue && (
                <p className="text-sm text-destructive">
                  {errors.issue.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">
                {t("requests.new.category")}
              </Label>
              <Select
                onValueChange={(v) => setValue("category", v as any)}
                defaultValue=""
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder={t("requests.new.categoryPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">
                {t("requests.new.description")}
              </Label>
              <Textarea
                id="description"
                placeholder={t("requests.new.descriptionPlaceholder")}
                rows={5}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Section 2: Request Details ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("requests.new.detailsSection")}</CardTitle>
            <CardDescription>
              {t("requests.new.detailsSectionHint")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {/* Priority */}
            <div className="grid gap-3">
              <Label>
                {t("requests.new.priority")} <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                defaultValue="MEDIUM"
                onValueChange={(v) => setValue("priority", v as any)}
                className="flex gap-4"
              >
                {PRIORITIES.map((p) => (
                  <Label
                    key={p.value}
                    htmlFor={`priority-${p.value}`}
                    className="flex flex-1 items-start gap-3 rounded-lg border p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <RadioGroupItem
                      value={p.value}
                      id={`priority-${p.value}`}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="font-medium text-sm">{p.label}</p>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
              {errors.priority && (
                <p className="text-sm text-destructive">
                  {errors.priority.message}
                </p>
              )}
            </div>

            <Separator />

            {/* Work Location */}
            <div className="grid gap-3">
              <Label>
                {t("requests.new.workLocation")} <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                defaultValue="NOT_SURE"
                onValueChange={(v) => setValue("workLocation", v as any)}
                className="flex gap-4"
              >
                {WORK_LOCATIONS.map((w) => (
                  <Label
                    key={w.value}
                    htmlFor={`wl-${w.value}`}
                    className="flex flex-1 items-start gap-3 rounded-lg border p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <RadioGroupItem
                      value={w.value}
                      id={`wl-${w.value}`}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="font-medium text-sm">{w.label}</p>
                      <p className="text-xs text-muted-foreground">{w.desc}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
              {errors.workLocation && (
                <p className="text-sm text-destructive">
                  {errors.workLocation.message}
                </p>
              )}
            </div>

            <Separator />

            {/* Budget */}
            <div className="grid gap-3">
              <Label>
                {t("requests.new.budget")} <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                defaultValue="NEGOTIABLE"
                onValueChange={(v) => setValue("budgetOption", v as any)}
                className="flex gap-4"
              >
                {BUDGET_OPTIONS.map((b) => (
                  <Label
                    key={b.value}
                    htmlFor={`bo-${b.value}`}
                    className="flex flex-1 items-start gap-3 rounded-lg border p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <RadioGroupItem
                      value={b.value}
                      id={`bo-${b.value}`}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="font-medium text-sm">{b.label}</p>
                      <p className="text-xs text-muted-foreground">{b.desc}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>

              {budgetOption === "FIXED" && (
                <div className="grid gap-2 mt-1">
                  <Label htmlFor="budget">
                    {t("requests.new.budgetAmount")}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="budget"
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-7"
                      {...register("budget")}
                    />
                  </div>
                  {errors.budget && (
                    <p className="text-sm text-destructive">
                      {errors.budget.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            <Separator />

            {/* Desired Completion Date */}
            <div className="grid gap-2">
              <Label htmlFor="desiredCompletionDate">
                {t("requests.new.completionDate")}
              </Label>
              <Input
                id="desiredCompletionDate"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                {...register("desiredCompletionDate")}
              />
              {errors.desiredCompletionDate && (
                <p className="text-sm text-destructive">
                  {errors.desiredCompletionDate.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Section 3: Location (conditional) ── */}
        {showAddressFields && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("requests.new.locationSection")}</CardTitle>
              <CardDescription>
                {workLocation === "ON_SITE"
                  ? t("requests.new.locationHintOnsite")
                  : t("requests.new.locationHintOther")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="street">{t("requests.new.streetAddress")}</Label>
                <Input
                  id="street"
                  placeholder={t("requests.new.streetAddressPlaceholder")}
                  {...register("street")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    placeholder={t("requests.new.cityPlaceholder")}
                    {...register("city")}
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    placeholder={t("requests.new.postalCodePlaceholder")}
                    {...register("postalCode")}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="province">Province</Label>
                <Select onValueChange={(v) => setValue("province", v)}>
                  <SelectTrigger id="province">
                    <SelectValue placeholder={t("requests.new.provincePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-md px-4 py-3">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pb-6">
          <Button variant="outline" type="button" asChild>
            <Link href="/requests">{t("requests.new.cancel")}</Link>
          </Button>
          <Button type="submit" disabled={submitting} className="min-w-36">
            {submitting ? t("requests.new.submitting") : t("requests.new.submit")}
          </Button>
        </div>
      </form>
    </div>
  )
}
