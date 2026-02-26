import { getSession } from "@/lib/server/getSession"
import { AccountSettingsClient } from "./components/account-settings-client"

export default async function AccountSettingsPage() {
  const session = await getSession()
  return (
    <AccountSettingsClient
      email={session.user?.email ?? ""}
      signUpMethod={session.user?.signUpMethod ?? null}
      createdAt={session.user?.createdAt ?? null}
      accountStatus={session.profile?.accountStatus ?? null}
      role={session.user?.role?.roleName ?? null}
    />
  )
}
