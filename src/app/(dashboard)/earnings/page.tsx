"use client"

import { useEffect, useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EarningsSummaryCard, type EarningsSummary } from "./components/earnings-summary-card"
import { EarningsList, type JobDetail } from "./components/earnings-list"

type Category = "ALL" | "CURRENT_MONTH" | "CURRENT_WEEK"

export default function EarningsPage() {
  const { t } = useTranslation()
  const [summary, setSummary] = useState<EarningsSummary | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(true)

  const [category, setCategory] = useState<Category>("ALL")
  const [jobs, setJobs] = useState<JobDetail[]>([])
  const [page, setPage] = useState(0)
  const [isLast, setIsLast] = useState(false)
  const [jobsLoading, setJobsLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    const load = async () => {
      setSummaryLoading(true)
      try {
        const res = await fetch("/api/earnings/summary")
        const json = await res.json()
        if (json.ok) setSummary(json.data as EarningsSummary)
      } finally {
        setSummaryLoading(false)
      }
    }
    void load()
  }, [])

  const loadJobs = useCallback(async (cat: Category, pg: number, append: boolean) => {
    if (pg === 0) setJobsLoading(true)
    else setLoadingMore(true)
    try {
      const res = await fetch(`/api/earnings/jobs/${cat}?page=${pg}`)
      const json = await res.json()
      if (json.ok) {
        const data = json.data as { content: JobDetail[]; last: boolean }
        setJobs((prev) => (append ? [...prev, ...data.content] : data.content))
        setIsLast(data.last)
        setPage(pg)
      }
    } finally {
      setJobsLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    void loadJobs(category, 0, false)
  }, [category, loadJobs])

  const handleTabChange = (value: string) => {
    setCategory(value as Category)
    setPage(0)
    setJobs([])
  }

  const tabLabels: { value: Category; label: string }[] = [
    { value: "ALL", label: t("earnings.allTime") },
    { value: "CURRENT_MONTH", label: t("earnings.thisMonth") },
    { value: "CURRENT_WEEK", label: t("earnings.thisWeek") },
  ]

  return (
    <div className="px-4 md:px-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("earnings.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("earnings.subtitle")}</p>
      </div>

      <EarningsSummaryCard summary={summary} loading={summaryLoading} />

      <div className="space-y-4">
        <Tabs value={category} onValueChange={handleTabChange}>
          <TabsList>
            {tabLabels.map(({ value, label }) => (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <EarningsList
          jobs={jobs}
          loading={jobsLoading}
          hasMore={!isLast}
          onLoadMore={() => void loadJobs(category, page + 1, true)}
          loadingMore={loadingMore}
        />
      </div>
    </div>
  )
}
