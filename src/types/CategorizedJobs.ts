import { UUIDVersion } from 'validator';
import { JobDetails } from './JobDetails';

export type CategorizedJobs = {
  id: UUIDVersion;
  /**
   * Category name (ALL, CURRENT_MONTH, CURRENT_WEEK)
   */
  category: string;

  /**
   * List of jobs in this category
   */
  jobs: JobDetails[];
};
