import { UUIDVersion } from 'validator';
import { Profile } from './Profile';
import { ServiceRequest } from './ServiceRequest';

export type PaymentRequestDetails = {
  id: string;
  amount: number;
  currency: string;
  profile: Profile;
  applicant: Profile;
  promoCodes: string[];
  applicationEntryId: number;
  serviceRequest: ServiceRequest;
};
export type Currency = ['USD', 'CAD'];
