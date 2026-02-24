export type Review = {
  id: number;
  rating: number;
  comment: string;
  tags: Tag[] | null;
  expertId?: string;
  missionId?: string | null;
  reviewerId?: string | null;
  reviewer: {
    id: string;
    username: string | null;
    fullName: string;
    firstName: string;
    lastName: string;
    title: string;
    avatarUrl: string;
  };
  reviewed: boolean | null;
  serviceRequestId: string | null;
  serviceRequestIssue: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Tag = {
  id: number;
  tagName: string;
};
