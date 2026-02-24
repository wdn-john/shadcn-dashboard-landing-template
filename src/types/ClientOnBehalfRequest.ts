import type { TranslatedText } from "./TranslatedText";

export type ClientOnBehalfRequest = {
  id: number;
  expertName: string;
  avatarUrl: string;
  profession: string;
  requestedAt: string; // ISO-8601 date-time
  message: TranslatedText;
};
