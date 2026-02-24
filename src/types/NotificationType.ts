export type NotificationType = {
  id: number;
  type:
    | "SERVICE_REQUEST"
    | "APPLICATION"
    | "USER"
    | "SYSTEM"
    | "IDENTITY_VERIFICATION"
    | "JOB_COMPLETED"
    | "JOB_STARTED"
    | "MISSION_APPROVED"
    | "APPLICATION_ENTRY"
    | "APPLICATION_REJECTED"
    | "MISSION_ASSIGNED"
    | "MISSION_REVISION_REQUEST";
  title: string;
  message: string;
  createdAt: string;
  entityId: number;
  isRead: boolean;
  sentFrom?: string; // Optional field for who sent the notification
  avatar?: string; // Optional avatar URL for user notifications
};
