import { serverGet } from "@/lib/server/api"
import { PromoCodesClient } from "./components/promo-codes-client"

export type PromoCode = {
  id: number
  code: string
  discountValue: number
  used: boolean
}

export default async function PromoCodesPage() {
  const codes = await serverGet<PromoCode[]>("/promo-codes")
  return <PromoCodesClient initialCodes={codes ?? []} />
}
