export type NewAssignedMissionNotificationPayload = {
  title: string;
  message: string;
  receiverId: string; // UUID is represented as string in TypeScript
  serviceRequestId: string;
};
