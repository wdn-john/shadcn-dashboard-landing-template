import { serverGet } from "@/lib/server/api"
import { ClipboardList } from "lucide-react"
import { JobList } from "./components/job-list"

type JobListItem = {
  id: number
  title: string
  progress: number
  expertName: string
  status: string
}

type PaginatedJobs = {
  content: JobListItem[]
  totalElements: number
}

export default async function JobsPage() {
  const res = await serverGet<PaginatedJobs>("/jobs/current-user?page=0")
  const jobs = res?.content ?? []

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Work in Progress</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor active missions and approve completed work.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <ClipboardList className="size-12 text-muted-foreground/30" />
          <p className="font-medium">No active jobs</p>
          <p className="text-sm text-muted-foreground">
            Once you hire an expert and they begin work, your jobs will appear here.
          </p>
        </div>
      ) : (
        <JobList initialJobs={jobs} />
      )}
    </div>
  )
}
