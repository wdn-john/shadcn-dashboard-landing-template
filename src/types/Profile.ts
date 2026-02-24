import { UUIDVersion } from "validator";
import { ExperienceType } from './Experience';
import { Review } from './Review';
import { Address } from './Address';
import { AccountStatus } from "./IdentityVerification";

// Minimal local definitions for small DTOs previously referenced from the app
export type Certification = { 
  id?: string; 
  name: string 
};

export type Skill = { 
  id: string; 
  name: string 
};

export type Software = { 
  id: string; 
  name: string 
};

export type PaymentMethod = { 
  id?: string; 
  brand?: string; 
  last4?: string; 
  image: string; 
  label: string; 
  paymentMethodId: string;
};

export type Profile = {
  id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  avatarUrl?: string;
  userCode?: string;
  qrCodeUrl?: string;
  dob?: Date;
  phoneNumber?: string;
  profession?: string;
  bio?: string;
  image?: string;
  language?: string;
  website?: string;
  streetAddress?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  userType?: string;
  industry?: string;
  professionCategory?: string;
  skills?: Skill[];
  certifications?: Certification[];
  numberOfEmployees?: number;
  businessName?: string;
  frequentlyUsedSoftware?: Software[];
  address?: Address;
  areaOfExpertise?: string;
  experiences?: ExperienceType[];
  personalInformationComplete?: boolean;
  additionalInformationComplete?: boolean;
  avatarComplete?: boolean;
  profileSetupComplete?: boolean;
  acceptedTerms?: boolean;
  paymentMethod?: PaymentMethod;
  receivedReviews?: Review[];
  accountStatus: AccountStatus;
  isTaxRegistered?: boolean;
  tvqNumber?: string;
  tpsNumber?: string;
};

export type ProfileCustom = {
  id: UUIDVersion;
  personal_information_complete: any;
  full_name: string;
  avatar_url: string;
  dob: Date;
  phone_number: string;
  profession: string;
  bio: string;
  image: string;
  language: string;
  website: string;
  street_address: string;
  city: string;
  province: string;
  postal_code: string;
  user_type: { code: string; name: string };
  profession_category: string;
  skills: Skill[];
  certifications: Certification[];
};
