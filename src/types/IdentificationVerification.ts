import { DocImage } from "./DocImage";

export type DocumentType = "drivers_license" | "passport" | null;
export type VerificationStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface IdentityVerificationData {
  step: VerificationStep;
  documentType: DocumentType;
  documentFrontImage: DocImage;
  documentBackImage: DocImage;
  selfieImage: DocImage;
  isRetrying: boolean;
  isSubmitted: boolean;
  submittedAt: Date | null;
}
