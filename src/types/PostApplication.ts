import { UUIDVersion } from "validator";
import { Profile } from "./Profile";

export type PostApplication = {
  applicantId?: string;  // UUID is represented as string in TypeScript
  chosen?: boolean;
  serviceRequestId: number | string;  // UUID is represented as string in TypeScript
  bid?: number | undefined;  // float in Java maps to number in TypeScript
  message?: string | undefined;
  estimatedCompletionDate?: string;
  price?: number;
  revisions?: number;
  availability?: string;
};

export type FetchedApplication = { 
  "applications": Profile 
};

export type ApplicationResponse = {
  applicant: Profile;
  chosen: boolean;
  created_at: string;
  uuid: UUIDVersion;
  owner: Profile;
  proposal: string | number | null;
  message: string | null;
};

export type AdditionalInformation = {
  bid?: number | undefined;
  message?: string | undefined;
};
