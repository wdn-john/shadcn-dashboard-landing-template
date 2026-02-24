import { UUIDVersion } from 'validator';

export type ApplicationEntryDetailsType = {
  id: number;
  title: string;
  status: string;
  category: string;
  budget: number;
  requestOwner: {
    id: string;
    name: string;
    firstName: string;
    avatar: string;
    subtitle: string;
  };
  applicantFirstName: string;
  estimatedDelivery: string;
  proposedPrice: number;
  revisions: number;
  availability: string;
  message: string;
  timeline: {
    label: string;
    date: string;
    color: string;
    done: boolean;
  }[];
};
