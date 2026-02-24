import { ChatSocketType } from "./ChatSocketType";
import { MainSocketType } from "./MainSocketType";

export interface WebSocketMessage<T = any> {
  type: MainSocketType | ChatSocketType;
  payload: T;
}