import { UUIDVersion } from "validator";

export type Message = {
  id?: UUIDVersion;
  chatroomId: number;
  sender?: string;
  senderName?: string;
  profilePicture?: string;
  receiver?: UUIDVersion;
  receiverName?: string;
  status: "SENT" | "DELIVERED" | "READ";
  content?: string;
  sentAt?: string;
};

export type ChatRoom = {
  id: UUIDVersion;
  name: string;
  description: string;
  isPrivate: boolean;
  senderAvatarUrl: string;
  receiverAvatarUrl: string;
  senderId: UUIDVersion;
  receiverId: UUIDVersion;
  senderName: string;
  receiverName: string;
  createdAt: string;
  updatedAt: string;
};

export type ChatRoomResponse = {
  id: UUIDVersion;
  name: string;
  description: string;
  isPrivate: boolean;
  senderAvatarUrl: string;
  receiverAvatarUrl: string;
};

export type ChatInfoType = {
  receiverAvatar: string;
  receiverName: string;
};