import { serverGet } from "@/lib/server/api"
import { ApplicationsList } from "./components/applications-list"

export type ApplicationSummary = {
  id: string
  title: string
  category: string
  amount: number
  status: string
  appliedAgo: string
}

type PaginatedResponse<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  last: boolean
}

export default async function ApplicationsPage() {
  const data = await serverGet<PaginatedResponse<ApplicationSummary>>(
    "/applications/my-application-entries?page=0&size=50&sort=id,desc"
  )
  return (
    <ApplicationsList
      initialItems={data?.content ?? []}
      totalElements={data?.totalElements ?? 0}
    />
  )
}
