export enum IdentityVerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REVIEWING = 'REVIEWING',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  VERIFIED = 'VERIFIED',
  UNVERIFIED = 'UNVERIFIED',
  PENDING_ID_VERIFICATION = 'PENDING_ID_VERIFICATION',         
}

export interface IdentityVerificationStatusResponse {
  status: IdentityVerificationStatus;
  rejectionReason: string | null;
  membershipNumber: string | null;
  accountStatus: AccountStatus;
}
