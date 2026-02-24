import { Profile } from './Profile';
import { Address } from './Address';

export type ServiceRequest = {
  id: number;
  uuid: string;
  uniqueCode: string;
  lastSequenceNumber: number;
  additionalBudgetInfo: string | null;
  address: Address;
  budget: number;
  budgetOption: string;
  agreedQuotedPrice: number;
  description: string;
  enteredAddress: string | null;
  issue: string;
  latitude: string;
  locationOption: string;
  longitude: string;
  priority: string;
  owner: Profile;
  ownerLeftReview: boolean;
  applicantLeftReview: boolean;
  assignedTo: Profile | null;
  startDate: string | null;
  endDate: string | null;
  estimatedCompletionTime: string | null;
  desiredCompletionDate: string | null;
  validationRequired: boolean;
  status: string | null;
  workLocation: string;
  attachments: ServiceRequestAttachments[];
  category: string;
  createdAt: string;
};

export type ServiceRequestAttachments = {
  id: number;
  label: string;
  attachmentUrl: string;
};
