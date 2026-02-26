import { serverGet } from "@/lib/server/api"
import { ExperienceClient } from "./components/experience-client"

export type Experience = {
  id: number
  title: string
  company: string
  location?: string
  description?: string
  startDate: string
  endDate?: string
  current: boolean
}

export default async function ExperiencePage() {
  const experiences = await serverGet<Experience[]>("/experiences")
  return <ExperienceClient initialExperiences={experiences ?? []} />
}
