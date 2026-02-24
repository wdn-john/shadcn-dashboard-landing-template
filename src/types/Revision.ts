import { MissionRevision } from './MissionRevision';

export interface Revision extends MissionRevision {}

export interface RevisionStep {
  id: number;
  summary: string;
  status: string;
  revision: Revision;
}
