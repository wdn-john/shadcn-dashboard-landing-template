export type ChatSocketType =
  | "heartbeat"
  | "heartbeat_ack"
  | "subscribe"
  | "custom"
  | "notification"
  | "new:chat:message"
  | "chat-heartbeat"
  | "typing:update"
  | "typing";