import { Attachment } from './Attachment';

export type JobRevisionPost = {
  title: string;
  description: string;
  attachments: Attachment[]; // files to upload
};
