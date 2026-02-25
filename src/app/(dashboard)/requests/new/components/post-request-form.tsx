"use client"

import { useState } from "react"
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

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z
  .object({
    issue: z.string().min(5, "Please describe the issue (min 5 characters)"),
    category: z.enum(
      ["SOFTWARE", "HARDWARE", "NETWORK", "SECURITY", "PROJECT", "OTHER"],
      {
        required_error: "Please select a category",
      }
    ),
    description: z
      .string()
      .min(20, "Please provide more detail (min 20 characters)"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
      required_error: "Select a priority",
    }),
    workLocation: z.enum(["ON_SITE", "REMOTE", "NOT_SURE"], {
      required_error: "Select a work location",
    }),
    budgetOption: z.enum(["NEGOTIABLE", "FIXED"], {
      required_error: "Select a budget type",
    }),
    budget: z.string().optional(),
    desiredCompletionDate: z
      .string()
      .min(1, "Please select a desired completion date"),
    // Address fields (required when ON_SITE or NOT_SURE)
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
        message: "Budget amount is required for a fixed price",
      })
    }
    if (data.workLocation !== "REMOTE") {
      if (!data.city)
        ctx.addIssue({
          code: "custom",
          path: ["city"],
          message: "City is required for on-site work",
        })
    }
  })

type FormValues = z.infer<typeof schema>

// ── Category/Enum labels ──────────────────────────────────────────────────────

const CATEGORIES = [
  { value: "SOFTWARE", label: "Software" },
  { value: "HARDWARE", label: "Hardware" },
  { value: "NETWORK", label: "Network" },
  { value: "SECURITY", label: "Security" },
  { value: "PROJECT", label: "Project" },
  { value: "OTHER", label: "Other" },
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
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

    // Build the address JSON string
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

    // Build FormData (backend expects multipart/form-data)
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
      setError(data.message ?? "Failed to post request. Please try again.")
      return
    }

    // Redirect to the new request's detail page or the requests list
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
            <ArrowLeft className="size-3" /> Back to requests
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          Post a Service Request
        </h1>
        <p className="text-muted-foreground mt-1">
          Describe your IT issue and verified experts will apply to help you.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* ── Section 1: The Problem ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Describe the Issue</CardTitle>
            <CardDescription>
              Be specific — experts will use this to write their proposals.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="issue">
                Issue Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="issue"
                placeholder="e.g. VPN not connecting after Windows update"
                {...register("issue")}
              />
              {errors.issue && (
                <p className="text-sm text-destructive">
                  {errors.issue.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={(v) => setValue("category", v as any)}
                defaultValue=""
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
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
                Detailed Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the problem in detail: when it started, what you've already tried, affected systems, error messages, etc."
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
            <CardTitle className="text-base">Request Details</CardTitle>
            <CardDescription>
              Help experts understand the scope and urgency.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {/* Priority */}
            <div className="grid gap-3">
              <Label>
                Priority <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                defaultValue="MEDIUM"
                onValueChange={(v) => setValue("priority", v as any)}
                className="flex gap-4"
              >
                {[
                  { value: "LOW", label: "Low", desc: "Not urgent" },
                  {
                    value: "MEDIUM",
                    label: "Medium",
                    desc: "Within a few days",
                  },
                  { value: "HIGH", label: "High", desc: "Urgent — ASAP" },
                ].map((p) => (
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
                Work Location <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                defaultValue="NOT_SURE"
                onValueChange={(v) => setValue("workLocation", v as any)}
                className="flex gap-4"
              >
                {[
                  {
                    value: "REMOTE",
                    label: "Remote",
                    desc: "Expert works remotely",
                  },
                  {
                    value: "ON_SITE",
                    label: "On-Site",
                    desc: "Expert comes to you",
                  },
                  {
                    value: "NOT_SURE",
                    label: "Not Sure",
                    desc: "Open to either",
                  },
                ].map((w) => (
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
                Budget <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                defaultValue="NEGOTIABLE"
                onValueChange={(v) => setValue("budgetOption", v as any)}
                className="flex gap-4"
              >
                {[
                  {
                    value: "NEGOTIABLE",
                    label: "Negotiable",
                    desc: "Experts can propose a price",
                  },
                  {
                    value: "FIXED",
                    label: "Fixed",
                    desc: "You set the budget",
                  },
                ].map((b) => (
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
                    Budget Amount (CAD){" "}
                    <span className="text-destructive">*</span>
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
                Desired Completion Date{" "}
                <span className="text-destructive">*</span>
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
              <CardTitle className="text-base">Location</CardTitle>
              <CardDescription>
                {workLocation === "ON_SITE"
                  ? "Required — the expert will come to this location."
                  : "Provide your location in case on-site work is needed."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  placeholder="123 Main Street"
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
                    placeholder="Montreal"
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
                    placeholder="H2X 1Y4"
                    {...register("postalCode")}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="province">Province</Label>
                <Select onValueChange={(v) => setValue("province", v)}>
                  <SelectTrigger id="province">
                    <SelectValue placeholder="Select province" />
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
            <Link href="/requests">Cancel</Link>
          </Button>
          <Button type="submit" disabled={submitting} className="min-w-36">
            {submitting ? "Posting..." : "Post Request"}
          </Button>
        </div>
      </form>
    </div>
  )
}
