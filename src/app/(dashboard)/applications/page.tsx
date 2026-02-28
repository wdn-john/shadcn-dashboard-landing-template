import { serverGet } from "@/lib/server/api"
import { getSession } from "@/lib/server/getSession"
import { ApplicationsList } from "./components/applications-list"
import { ClientApplicationsList } from "./components/client-applications-list"
import type { Session } from "@/types/Session"

export type ApplicationSummary = {
  id: string
  title: string
  category: string
  amount: number
  status: string
  appliedAgo: string
}

export type ClientApplication = {
  id: number
  title: string
  applicants: number
  postedAgo: string
  status: string
  description: string
  daysLeft: number
  priceRange: string
}

type PaginatedResponse<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  last: boolean
}

export default async function ApplicationsPage() {
  const session = await getSession()
  const rawRole = (session as Session)?.user?.role?.roleName ?? ""
  const isClient =
    rawRole === "ROLE_CLIENT" || rawRole === "CLIENT"

  if (isClient) {
    const data = await serverGet<{ content: ClientApplication[] }>(
      "/applications/current-user"
    )
    return <ClientApplicationsList applications={data?.content ?? []} />
  }

  // Expert / default view
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
