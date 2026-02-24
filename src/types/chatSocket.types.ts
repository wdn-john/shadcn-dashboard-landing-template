import { ChatSocketType } from "./ChatSocketType";
import { TokenProvider } from "./TokenProvider";
import { WebSocketMessage } from "./WebSocketMessage";
import { WSHandler } from "./WSHandler";

export type ChatSocketOptions = {
  url: string;                        // full WS url OR base url (we'll add ?token=)
  getToken: TokenProvider;            // inject from app (useAuthStore)
  WebSocketImpl?: typeof WebSocket;   // optional override, defaults to globalThis.WebSocket
  heartbeatMs?: number;               // default 10_000
  maxReconnects?: number;             // default 10
  log?: (...args: any[]) => void;     // optional logger
};

export type ChatSocket = {
  connect(): Promise<void>;
  disconnect(): void;
  send<T>(msg: WebSocketMessage<T>): void;
  subscribe(topic: string): void;

  on(type: ChatSocketType, handler: WSHandler): void;
  off(type: ChatSocketType): void;

  // lightweight state readers
  isConnected(): boolean;
  isConnecting(): boolean;
  getSubscriptions(): Set<string>;
};