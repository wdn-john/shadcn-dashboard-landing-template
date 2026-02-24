export interface Attachment {
  id?: number | null;
  index: number;
  uri?: string;
  url?: string;
  name?: string;
  label?: string;
  icon?: string;
  size: string;
  type?: string;
  canBeDeletedByExpert?: boolean;
  file?: FormData;
};
