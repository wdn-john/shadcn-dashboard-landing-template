import { serverGet } from "@/lib/server/api"
import { VerificationsClient } from "./components/verifications-client"

type VerificationItem = {
  id: string
  name: string
  email: string
  avatarUrl: string
  status: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED"
  timeAgo: string
  jobTitle: string
}

type PaginatedResponse<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export default async function VerificationsPage() {
  const data = await serverGet<PaginatedResponse<VerificationItem>>(
    "/admin/identity-verification?page=0&size=50&sort=createdAt,desc"
  )
  return <VerificationsClient initialItems={data?.content ?? []} totalElements={data?.totalElements ?? 0} />
}
