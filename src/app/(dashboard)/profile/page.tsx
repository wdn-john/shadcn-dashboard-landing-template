import { getSession } from "@/lib/server/getSession"
import { serverGet } from "@/lib/server/api"
import { ProfileEditor } from "./components/profile-editor"
import type { ProfileDTO } from "./components/profile-editor"

export default async function ProfilePage() {
  const session = await getSession()
  const profileId = session.profile?.id

  const profile = profileId
    ? await serverGet<ProfileDTO>(`/profiles/${profileId}`)
    : null

  return <ProfileEditor profile={profile} />
}
