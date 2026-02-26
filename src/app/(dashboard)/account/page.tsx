import { getSession } from "@/lib/server/getSession"
import { AccountHub } from "./components/account-hub"

export default async function AccountPage() {
  const session = await getSession()
  return (
    <AccountHub
      fullName={session.profile?.fullName ?? null}
      firstName={session.profile?.firstName ?? null}
      email={session.user?.email ?? null}
      avatarUrl={session.profile?.avatarUrl ?? null}
      title={session.profile?.title ?? null}
      accountStatus={session.profile?.accountStatus ?? null}
      userType={session.profile?.userType ?? null}
    />
  )
}
