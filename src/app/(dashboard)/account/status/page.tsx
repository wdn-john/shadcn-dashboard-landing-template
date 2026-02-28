import { getSession } from "@/lib/server/getSession"
import { AccountStatusClient } from "./components/account-status-client"
import { Session } from "@/types/Session"

export default async function AccountStatusPage() {
  const session = await getSession()
  const accountStatus = (session as Session)?.profile?.accountStatus ?? null

  return <AccountStatusClient accountStatus={accountStatus} />
}
