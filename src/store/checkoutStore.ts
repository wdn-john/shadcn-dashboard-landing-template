import { create } from "zustand"

export type CheckoutDetails = {
  applicationId: number
  applicationEntryId: number
  serviceRequestId: number
  finalPrice: number
  subTotal: number
  platformFee: number
  tps: number
  tvq: number
  total: number
  promoCode?: string
  msg?: string
  // Resolved names for display
  expertName?: string
  expertAvatar?: string
  requestTitle?: string
}

interface CheckoutState {
  details: CheckoutDetails | null
  appliedPromoCodes: string[]
  setDetails: (d: CheckoutDetails) => void
  setAppliedPromoCodes: (codes: string[]) => void
  reset: () => void
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  details: null,
  appliedPromoCodes: [],
  setDetails: (d) => set({ details: d }),
  setAppliedPromoCodes: (codes) => set({ appliedPromoCodes: codes }),
  reset: () => set({ details: null, appliedPromoCodes: [] }),
}))
