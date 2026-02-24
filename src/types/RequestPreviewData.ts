export type RequestPreviewData = {
  id: number;
  title?: string;
  subtitle?: string;
  requestId?: string;
  requestOwnerId: string;
  submittedAgo?: string;
  price?: number;
  priceLabel?: string;
  address?: string;
  addressDetails?: string;
  distanceEta?: string;
  clientName?: string;
  clientAvatar?: string;
  clientRating?: number; // 0..5
  clientReviews?: number;
  priority?: 'Low' | 'Medium' | 'High';
  eta?: string;
  longitude: string;
  latitude: string;
};
