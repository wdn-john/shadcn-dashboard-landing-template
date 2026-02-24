import { WebSocketMessage, WSHandler } from "@workedin/types";
import { MainSocketType } from "./MainSocketType";

export type WebSocketClient = {
  connect(): Promise<void>;
  disconnect(): void;
  send<T>(msg: WebSocketMessage<T>): void;
  subscribe(topic: string): void;

  on(type: MainSocketType, handler: WSHandler): void;
  off(type: MainSocketType): void;

  isConnected(): boolean;
  isConnecting(): boolean;
  getSubscriptions(): Set<string>;
};