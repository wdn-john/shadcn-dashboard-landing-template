/**
 * Represents a lightweight summary of a user's service request.
 * Used in lists, dashboards, and summaries.
 */
export interface ServiceRequestSummaryDTO {
  id: number;
  title: string;
  category: string;
  status: ServiceRequestStatus;
  price: number;
  currency: string;
  createdAt: string; // ISO date
  updatedAt?: string;

  // optional for UI
  description?: string;
  attachmentsCount?: number;
  applicationsCount?: number;
  acceptedCandidateName?: string;
  acceptedCandidateId?: number;
}

/**
 * Enum-like union for service request statuses.
 */
export type ServiceRequestStatus =
  | "PENDING"
  | "OPEN"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "ARCHIVED";