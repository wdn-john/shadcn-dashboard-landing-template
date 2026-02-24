import { AddressSnapshot } from './AddressSnapshot';
import { MissionAttachmentDTO } from './MissionAttachmentDTO';
import { PaymentDTO } from './PaymentDTO';

export type MissionDetailsDTO = {
  id: number;
  progressId: number;
  status: string; // always "accepted" for now
  title: string;
  description: string;

  // Enums (use your actual unions/enums if available)
  payoutStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'ON_HOLD' | 'REFUNDED' | 'TRANSFERRING'; // PaymentStatusEnum
  workLocation: 'ON_SITE' | 'REMOTE' | 'NOT_SURE'; // ServiceRequestWorkLocationEnum
  priority: 'LOW' | 'MEDIUM' | 'HIGH'; // ServiceRequestPriorityEnum

  finalQuotedPrice: number;
  desiredCompletionDate: string | null; // ISO 8601 date-time

  clientName: string;
  clientId: string;
  clientAvatarUrl: string | null;
  clientCode: string;
  clientProfession: string;
  clientTitle: string;
  clientBusinessName?: string;


  expertName: string;
  expertId: string;
  expertAvatarUrl: string | null;
  expertCode: string;

  attachments: MissionAttachmentDTO[]; // MissionAttachmentDTO[]
  address: AddressSnapshot | null; // AddressSnapshot
  allMissionStepsCompleted: boolean;
  revisionCount: number;
  missionStepsCompletedAt: string | null; // ISO 8601 date-time
  paymentDetails: PaymentDTO;
  receiptUrl?: string | null;
};


