import { WSHandler } from "@/types/WSHandler";
import { MainSocketType } from "./MainSocketType";

export type WSHandlerMap = Partial<Record<MainSocketType, WSHandler>>;