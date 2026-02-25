import { getSession } from "@/lib/server/getSession"
import { serverGet } from "@/lib/server/api"
import { ClientDashboard } from "./components/client-dashboard"
import { ExpertDashboard } from "./components/expert-dashboard"
import { AdminDashboard } from "./components/admin-dashboard"

type MyRequestSummary = {
  id: number
  title: string
  description: string
  posted: string
  price: number
  status: string
}

type ServiceRequestItem = {
  id: number
  issue: string
  description: string
  category: string
  priority: string
  budget: number
  workLocation: string
  status: string
  createdAt: string
}

type PaginatedResponse<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export default async function DashboardPage() {
  const session = await getSession()
  const role = session.user?.role?.roleName
  const firstName = session.profile?.firstName

  // ── CLIENT ────────────────────────────────────────────────────────────────
  if (role === "ROLE_CLIENT") {
    const requestsRes =
      await serverGet<PaginatedResponse<MyRequestSummary>>("/service-requests/my-request-summary")
    const requests = requestsRes?.content ?? []

    return (
      <ClientDashboard
        firstName={firstName}
        requests={requests}
      />
    )
  }

  // ── EXPERT ────────────────────────────────────────────────────────────────
  if (role === "ROLE_EXPERT") {
    const paginated = await serverGet<PaginatedResponse<ServiceRequestItem>>(
      "/service-requests?page=0&size=6&sort=createdAt,desc"
    )

    return (
      <ExpertDashboard
        firstName={firstName}
        availableRequests={paginated?.content ?? []}
        totalAvailable={paginated?.totalElements ?? 0}
      />
    )
  }

  // ── ADMIN ─────────────────────────────────────────────────────────────────
  return <AdminDashboard firstName={firstName} />
}
