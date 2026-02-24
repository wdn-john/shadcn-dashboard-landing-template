import { Note } from './types';
import { Attachment } from './Attachment';

export type MissionStepUpdateDTO = {
  id: number | null;
  isCompleted?: boolean | false;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'BLOCKED' | null;
  note: Note | null;
  attachments: Attachment[] | null;
};
