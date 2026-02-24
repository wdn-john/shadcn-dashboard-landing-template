export type ExpertOnBehalfRequest = {
  id: number;
  clientName: string;
  clientCode: string;
  srUniqueCode: string;
  avatarUrl: string;
  profession: string;
  requestedAt: string; // ISO-8601 date-time string
  status: string;
};
