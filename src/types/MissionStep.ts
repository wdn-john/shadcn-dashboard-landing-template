import { Note } from './types';
import { Attachment } from './Attachment';
import { TranslatedText } from './TranslatedText';

export type MissionStep = {
  id: number;
  title: TranslatedText;
  orderIndex: number;
  summary: TranslatedText;
  instructions?: TranslatedText;
  note: Note | null;
  attachments: Attachment[];
  expanded: boolean;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'BLOCKED' | 'SKIPPED';
  isNew?: boolean;
  isToDelete?: boolean;
};
