import { Profile } from './Profile';
import { ServiceRequest } from './ServiceRequest';

export type ApplicationEntryDetails = {
  id: number;
  uuid: string;
  applicationId: number;
  applicant: Profile;
  availability: string;
  message: string;
  estimatedDelivery: Date;
  allowedRevisions: number;
  bid: number;
  status: 'Pending' | 'Accepted' | 'Rejected';
  serviceRequest: ServiceRequest;
  averageRating: number;
  numberOfReviews: number;
  createdAt: Date;
  updatedAt: Date;
};
