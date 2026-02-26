import { serverGet } from "@/lib/server/api"
import { UsersClient } from "./components/users-client"

export type ProfileItem = {
  id: string
  fullName: string
  avatarUrl: string
  userType: string | null
  accountStatus: string
  membershipNumber: string | null
  bio: string | null
  createdAt: string
  user?: {
    email?: string
    username?: string
  }
}

export default async function AdminUsersPage() {
  const profiles = await serverGet<ProfileItem[]>("/admin/profiles")
  return <UsersClient initialProfiles={profiles ?? []} />
}
