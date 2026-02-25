export type Message = {
  id?: string;
  chatroomId: number;
  sender?: string;
  senderName?: string;
  profilePicture?: string;
  receiver?: string;
  receiverName?: string;
  status: "SENT" | "DELIVERED" | "READ";
  content?: string;
  sentAt?: string;
};

export type ChatRoom = {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  senderAvatarUrl: string;
  receiverAvatarUrl: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  createdAt: string;
  updatedAt: string;
};

export type ChatRoomResponse = {
  id: string;
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