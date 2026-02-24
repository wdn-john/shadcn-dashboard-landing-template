import { Note } from './types';
import { Attachment } from './Attachment';

export type MissionUpdateDTO = {
  id: number;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'BLOCKED';
  notes?: Note[];
  attachments?: Attachment[];
};
