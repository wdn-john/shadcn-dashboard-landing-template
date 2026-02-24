import { ApplicationEntry } from './ApplicationEntry';
import { ApplicationEntryDetails } from './ApplicationEntryDetails';
import { ServiceRequest } from './ServiceRequest';

export type CheckoutDetails = {
  msg: string;
  serviceRequest: ServiceRequest;
  applicationEntry: ApplicationEntryDetails;
  applicationId: number;
  finalPrice: number;
  promoCode: string;
  subTotal: number;
  platformFee: number;
  tps: number;
  tvq: number;
  total: number;
};
