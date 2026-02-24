export interface ChatListItem {
  id: number;
  name: string;
  avatar: string | null;
  lastMessage: string | null;
  recipientId: string | null;
  time: string; // ISO 8601 date-time string (e.g., "2025-09-18T12:34:56")
  status?: string | null;
  unreadCount?: number | null;
  delivered?: boolean | null;
  read?: boolean | null;
}
