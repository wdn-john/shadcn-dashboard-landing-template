import { Profile } from './Profile';

export type ApplicationEntry = {
  id: number; // changed to string for FlatList key
  fullName: string;
  avatarUrl: string;
  message: string | null; // used as description
  estimatedDelivery: string | null; // used as duration
  allowedRevisions: number;
  bid: string; // changed to string for formatting
  chosen: boolean | null;
  averageRating: number;
  createdAt: string; // used as applied
  status: 'Pending' | 'Accepted' | 'Rejected'; // added for status badge
};
