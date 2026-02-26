import { serverGet } from "@/lib/server/api"
import { SkillsClient } from "./components/skills-client"

export type SkillItem = { id: string; name: string }
export type CertItem  = { id: string; name: string }

export default async function SkillsPage() {
  const [skills, certifications] = await Promise.all([
    serverGet<SkillItem[]>("/skills"),
    serverGet<CertItem[]>("/certifications"),
  ])
  return <SkillsClient initialSkills={skills ?? []} initialCerts={certifications ?? []} />
}
