import { getSession } from "@/lib/server/getSession"
import { ActivateClient } from "./components/activate-client"

export default async function ActivatePage() {
  const session = await getSession()
  const accountStatus = session.profile?.accountStatus ?? null
  return <ActivateClient accountStatus={accountStatus as string | null} />
}
