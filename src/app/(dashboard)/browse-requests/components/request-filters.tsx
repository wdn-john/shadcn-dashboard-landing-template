"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useTranslation } from "react-i18next"

const CATEGORY_VALUES = ["Software", "Hardware", "Network", "Security", "Project", "Other"]
const PRIORITY_VALUES = ["Low", "Medium", "High"]

export function RequestFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { t } = useTranslation()

  const category = searchParams.get("category") ?? ""
  const priority = searchParams.get("priority") ?? ""
  const workLocation = searchParams.get("workLocation") ?? ""

  const hasFilters = category || priority || workLocation

  const WORK_LOCATIONS = [
    { value: "REMOTE", label: t("filters.remote") },
    { value: "ON_SITE", label: t("filters.onSite") },
    { value: "NOT_SURE", label: t("filters.notSure") },
  ]

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete("page") // reset to page 1 on filter change
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  function clearFilters() {
    router.push(pathname)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={category} onValueChange={(v) => setParam("category", v === "all" ? "" : v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder={t("filters.category")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("filters.allCategories")}</SelectItem>
          {CATEGORY_VALUES.map((c) => (
            <SelectItem key={c} value={c}>{t(`filters.categories.${c.toLowerCase()}`)}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={priority} onValueChange={(v) => setParam("priority", v === "all" ? "" : v)}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder={t("filters.priority")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("filters.allPriorities")}</SelectItem>
          {PRIORITY_VALUES.map((p) => (
            <SelectItem key={p} value={p}>{t(`filters.priorities.${p.toLowerCase()}`)}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={workLocation}
        onValueChange={(v) => setParam("workLocation", v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder={t("filters.location")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("filters.allLocations")}</SelectItem>
          {WORK_LOCATIONS.map((w) => (
            <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
          <X className="size-3" />
          {t("filters.clearFilters")}
        </Button>
      )}
    </div>
  )
}
