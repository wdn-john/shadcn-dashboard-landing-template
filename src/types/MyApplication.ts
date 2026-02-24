import { ApplicationStatus } from './ApplicationStatus';

export type MyApplicationSummary = {
  id: number;
  title: string;
  category: string;
  amount: number;
  status: ApplicationStatus;
  appliedAgo: string;
};
