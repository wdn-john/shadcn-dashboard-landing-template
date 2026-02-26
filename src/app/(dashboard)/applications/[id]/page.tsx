import { serverGet } from "@/lib/server/api"
import { notFound } from "next/navigation"
import { ApplicationDetail } from "./components/application-detail"

export type EntryDetails = {
  id: number
  title: string
  status: string
  category: string
  budget: number
  requestOwner: {
    id: string
    name: string
    firstName: string
    avatar: string
    subtitle: string
  }
  applicantFirstName: string
  estimatedDelivery: string
  proposedPrice: number
  revisions: number
  availability: string
  message: string
  timeline: Array<{
    label: string
    createdAt: string
    color: string
  }>
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const details = await serverGet<EntryDetails>(`/applications/entry-details/${id}`)
  if (!details) notFound()
  return <ApplicationDetail details={details} entryId={Number(id)} />
}
