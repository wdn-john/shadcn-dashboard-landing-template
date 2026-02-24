import { Profile } from './Profile';

export type OrderDetails = {
  amount: number; // or string if you're dealing with precise decimal strings
  currency: string;
  profile: Profile; // Replace with the actual Profile type definition
  promoCode: string[];
};
