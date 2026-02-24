import { WSHandler } from "@workedin/types";
import { MainSocketType } from "./MainSocketType";

export type WSHandlerMap = Partial<Record<MainSocketType, WSHandler>>;