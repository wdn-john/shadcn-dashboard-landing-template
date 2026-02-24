import { NotificationType } from "./NotificationType";

/**
 * Core notification structure shared between backend and frontend.
 */
export interface NotificationDTO {
  id: number | string; // numeric or UUID
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string; // ISO timestamp
  updatedAt?: string; // optional for tracking updates
  link?: string; // optional deep link or redirect path
  iconUrl?: string; // optional small icon or avatar
  metadata?: Record<string, any>; // optional contextual data
}
