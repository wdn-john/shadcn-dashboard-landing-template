import { getSession } from "@/lib/server/getSession"
import { TaxDetailsClient } from "./components/tax-details-client"

export default async function TaxDetailsPage() {
  const session = await getSession()
  return (
    <TaxDetailsClient
      initialTpsNumber={session.profile?.tpsNumber ?? ""}
      initialTvqNumber={session.profile?.tvqNumber ?? ""}
      initialIsTaxRegistered={session.profile?.isTaxRegistered ?? false}
    />
  )
}
