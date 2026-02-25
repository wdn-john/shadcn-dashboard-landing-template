import { create } from "zustand"

export type AccountType = "client" | "expert"
export type ExperienceLevel = "Junior" | "Mid" | "Senior" | "Expert"

export interface PersonalData {
  firstName: string
  lastName: string
  preferredName: string
  dateOfBirth: string // YYYY-MM-DD
  phone: string
  language: "en" | "fr"
  title: string
  organizationName: string
  organizationEmployees: string
}

export interface ExpertiseData {
  profession: string
  category: string
  skills: string[]
  certifications: string[]
  frequentlyUsedSoftwares: string[]
  experienceLevel: ExperienceLevel
  yearsExperience: number
  hourlyRate: string
}

export interface IdentityData {
  streetAddress: string
  city: string
  postalCode: string
  province: string
}

export interface PaymentData {
  skipped: boolean
  // Expert: Stripe Connect
  stripeConnected: boolean
  stripeAccount: { id: string; email: string } | null
  // Client: card
  paymentMethodId: string
  cardholderName: string
  billingCountry: string
  billingPostalCode: string
}

export interface AvatarData {
  base64: string
  filename: string
  mimeType: string
  previewUrl: string
}

interface ProfileSetupState {
  currentStep: number
  accountType: AccountType | null
  personal: PersonalData
  expertise: ExpertiseData
  identity: IdentityData
  payment: PaymentData
  avatar: AvatarData

  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setAccountType: (type: AccountType) => void
  setPersonal: (data: Partial<PersonalData>) => void
  setExpertise: (data: Partial<ExpertiseData>) => void
  setIdentity: (data: Partial<IdentityData>) => void
  setPayment: (data: Partial<PaymentData>) => void
  setAvatar: (data: Partial<AvatarData>) => void
  reset: () => void
}

const defaultPersonal: PersonalData = {
  firstName: "",
  lastName: "",
  preferredName: "",
  dateOfBirth: "",
  phone: "",
  language: "en",
  title: "",
  organizationName: "",
  organizationEmployees: "",
}

const defaultExpertise: ExpertiseData = {
  profession: "",
  category: "",
  skills: [],
  certifications: [],
  frequentlyUsedSoftwares: [],
  experienceLevel: "Junior",
  yearsExperience: 0,
  hourlyRate: "",
}

const defaultIdentity: IdentityData = {
  streetAddress: "",
  city: "",
  postalCode: "",
  province: "",
}

const defaultPayment: PaymentData = {
  skipped: false,
  stripeConnected: false,
  stripeAccount: null,
  paymentMethodId: "",
  cardholderName: "",
  billingCountry: "CA",
  billingPostalCode: "",
}

const defaultAvatar: AvatarData = {
  base64: "",
  filename: "",
  mimeType: "",
  previewUrl: "",
}

export const useProfileSetupStore = create<ProfileSetupState>((set) => ({
  currentStep: 1,
  accountType: null,
  personal: defaultPersonal,
  expertise: defaultExpertise,
  identity: defaultIdentity,
  payment: defaultPayment,
  avatar: defaultAvatar,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 7) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
  setAccountType: (type) => set({ accountType: type }),
  setPersonal: (data) => set((s) => ({ personal: { ...s.personal, ...data } })),
  setExpertise: (data) => set((s) => ({ expertise: { ...s.expertise, ...data } })),
  setIdentity: (data) => set((s) => ({ identity: { ...s.identity, ...data } })),
  setPayment: (data) => set((s) => ({ payment: { ...s.payment, ...data } })),
  setAvatar: (data) => set((s) => ({ avatar: { ...s.avatar, ...data } })),
  reset: () =>
    set({
      currentStep: 1,
      accountType: null,
      personal: defaultPersonal,
      expertise: defaultExpertise,
      identity: defaultIdentity,
      payment: defaultPayment,
      avatar: defaultAvatar,
    }),
}))
