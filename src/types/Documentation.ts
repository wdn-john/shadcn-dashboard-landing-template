export type DocumentationSummary = {
  id: string;
  name: string;
  description: string;
  type: 'INFRA' | 'SR';
  numberOfFields: number;
  createdAt: string;
};

export type DocumentationSearchCriteria = {
  name?: string;
  description?: string;
  type?: string;
};

export type documentationDetails = {
  id: string;
  name: string;
  description: string;
};

export type DocumentationField = {
  id: number;
  name: string;
  value: string;
  attachments: DocumentFieldAttachmentDTO[];
  type: 'SECRET' | 'PLAIN_TEXT';
  show: boolean;
};

interface DocumentFieldAttachmentDTO {
  id: number;
  url: string;
  type: string;
  label: string;
  size: string;
}

enum DocumentationFieldType {
  SECRET,
  PLAIN_TEXT,
}

interface DocumentationCreatedByUserDTO {
  fullName: string;
  avatarUrl: string;
}

export type DocumentationDTO = {
  id: number;
  name: string;
  description: string;
  type: 'INFRA' | 'SR';
  fields: DocumentationField[];
  createdBy: DocumentationCreatedByUserDTO;
  serviceRequest: DocumentationServiceRequestDTO;
  createdAt: string;
  updatedAt: string;
};

export type DocumentationServiceRequestDTO = {
  id: number;
  issue: string;
};
