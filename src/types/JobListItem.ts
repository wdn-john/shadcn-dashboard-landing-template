export type JobListItem = {
  id: number;
  title: string;
  progress: number;
  expertName: string;
  status: 'In Progress' | 'Completed' | 'Pending' | 'Cancelled';
};
