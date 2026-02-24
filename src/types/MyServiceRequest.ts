export type MyServiceRequest = {
  id: number;
  title: string;
  description: string;
  posted: string;
  price: number;
  status: "Open" | "Assigned" | "Completed" | "Pending" | "In Progress";
};