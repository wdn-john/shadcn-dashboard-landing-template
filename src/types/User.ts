import { UUIDVersion } from 'validator';
import { Role } from './Roles';

export type UserDTO = {
  id: UUIDVersion;
  email: string;
  firstName?: string;
  lastName?: string;
  accountNonLocked: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  enabled: boolean;
  credentialsExpiryDate: string; // Assuming LocalDate is represented as a string
  accountExpiryDate: string; // Assuming LocalDate is represented as a string
  twoFactorSecret: string;
  isTwoFactorEnabled: boolean;
  signUpMethod: string;
  role: Role; // Assuming Role is another type or enum
  createdAt: string; // Assuming LocalDateTime is represented as a string
  updatedAt: string; // Assuming LocalDateTime is represented as a string
};
