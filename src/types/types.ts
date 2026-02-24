import { Attachment } from "./Attachment";
import { TranslatedText } from "./TranslatedText";

export type Note = { id?: number | null; index: number; text: string; createdAt: string }
export interface ExpertMissionTrackerStep {
  id: number
  title: TranslatedText
  status: 'completed' | 'inprogress' | 'pending' | 'blocked'
  notes: Note[]
  attachments: Attachment[]
  expanded?: boolean
}

export const COLORS = {
  primary: '#3773E8',
  secondary: '#ff0000ff',
  inprogress: '#3773E8',
  completed: '#DCFCE7',
  danger: '#f44336',
  lightGray: '#f3f4f6',
  border: '#e5e7eb79',
}

// Named exports: import { Step, Note, Attachment, COLORS } from './types'
