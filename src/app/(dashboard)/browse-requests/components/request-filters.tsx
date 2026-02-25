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

const CATEGORIES = ["Software", "Hardware", "Network", "Security", "Project", "Other"]
const PRIORITIES = ["Low", "Medium", "High"]
const WORK_LOCATIONS = [
  { value: "REMOTE", label: "Remote" },
  { value: "ON_SITE", label: "On-Site" },
  { value: "NOT_SURE", label: "Not Sure" },
]

export function RequestFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const category = searchParams.get("category") ?? ""
  const priority = searchParams.get("priority") ?? ""
  const workLocation = searchParams.get("workLocation") ?? ""

  const hasFilters = category || priority || workLocation

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
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={priority} onValueChange={(v) => setParam("priority", v === "all" ? "" : v)}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          {PRIORITIES.map((p) => (
            <SelectItem key={p} value={p}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={workLocation}
        onValueChange={(v) => setParam("workLocation", v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {WORK_LOCATIONS.map((w) => (
            <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
          <X className="size-3" />
          Clear filters
        </Button>
      )}
    </div>
  )
}
