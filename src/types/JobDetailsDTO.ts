import { MissionAttachmentDTO } from "./MissionAttachmentDTO";
import { AddressSnapshot } from "./AddressSnapshot";

export type JobDetailsDTO = {
  id: number;
  uniqueCode: string;
  progressId: number;
  progress: number;
  category: string;
  status: string; // always "accepted" for now
  title: string;
  description: string;

  // Enums (use your actual unions/enums if available)
  payoutStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'ON_HOLD' | 'REFUNDED'; // PaymentStatusEnum
  workLocation: 'ON_SITE' | 'REMOTE' | 'NOT_SURE'; // ServiceRequestWorkLocationEnum
  priority: 'LOW' | 'MEDIUM' | 'HIGH'; // ServiceRequestPriorityEnum

  budget: number;
  finalQuotedPrice: number;
  desiredCompletionDate: string | null; // ISO 8601 date-time
  estimatedCompletionTime: string | null; // ISO 8601 date-time

  clientName: string;
  clientId: string;
  clientAvatarUrl: string | null;
  clientCode: string;
  clientProfession: string;
  clientTitle: string;
  clientBusinessName?: string;
  expertProfession: string;
  expertTitle: string;
  expertBusinessName?: string;

  expertName: string;
  expertId: string;
  expertAvatarUrl: string | null;
  expertCode: string;

  attachments: MissionAttachmentDTO[]; // MissionAttachmentDTO[]
  address: AddressSnapshot | null; // AddressSnapshot
  allMissionStepsCompleted: boolean;
  missionStepsCompletedAt: string | null; // ISO 8601 date-time
  requestCreatedAt: string; // ISO 8601 date-time
  startDate: string; // ISO 8601 date-time
  revisionCount: number;
  receiptUrl?: string | null; // URL to view receipt when job is completed
};