export type MissionListItem = {
  id: number;
  title: string;
  progress: number;
  clientName: string;
  status: 'In Progress' | 'Completed' | 'Pending' | 'Cancelled';
};
