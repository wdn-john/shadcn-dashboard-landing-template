import { Attachment } from './Attachment';
import { ServiceRequest } from './ServiceRequest';
import { TranslatedText } from './TranslatedText';

export type PostMissionRevision = {
  id?: number;
  message: string;
  attachments: Attachment[];
  documentation: RevisionDocumentation[];
  status: string;
  serviceRequestUuid: string;
};

export interface MissionRevision {
  id: number;
  message: string;
  attachments: RevisionAttachment[];
  status: string;
  serviceRequestId: number;
  documentation: RevisionDocumentation;
  createdAt: string; // ISO 8601 datetime string in format "yyyy-MM-dd'T'HH:mm:ss.SSSSSS"
  updatedAt: string; // ISO 8601 datetime string in format "yyyy-MM-dd'T'HH:mm:ss.SSSSSS"
}

export interface RevisionDocumentation {
  id: number;
  documentation: string;
  attachments: RevisionAttachment[]; // Note: WorkRevisionAttachmentDto type not shown in provided code
}

interface RevisionAttachment {
  id: number;
  attachmentUrl: string;
  createdAt: string; // ISO DateTime string
  updatedAt: string; // ISO DateTime string
}

export interface MissionRevisionProgress {
  id: number;
  title: string;
  steps: MissionRevisionSteps[];
  currentStep: number | null;
  isCompleted: boolean | null;
  missionRevision: MissionRevision;
}

export interface MissionRevisionSteps {
  id: number;
  title: TranslatedText;
  summary: TranslatedText;
  status: string;
  instructions: TranslatedText;
  documentationNote: string | null;
  orderIndex: number;
  isNew: boolean;
}
