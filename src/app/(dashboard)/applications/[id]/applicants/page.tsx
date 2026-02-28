import { notFound } from "next/navigation"
import { serverGet } from "@/lib/server/api"
import { ApplicantsView } from "./components/applicants-view"

type ApplicantEntry = {
  id: number
  fullName: string
  avatarUrl: string | null
  message: string | null
  estimatedDelivery: string | null
  allowedRevisions: number
  bid: string
  chosen: boolean | null
  averageRating: number
  createdAt: string
  status: "Pending" | "Accepted" | "Rejected"
}

export default async function ClientApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const applicants = await serverGet<ApplicantEntry[]>(
    `/applications/applicants/${id}`
  )

  if (!applicants) notFound()

  return (
    <ApplicantsView
      applicationId={Number(id)}
      initialApplicants={applicants}
    />
  )
}
