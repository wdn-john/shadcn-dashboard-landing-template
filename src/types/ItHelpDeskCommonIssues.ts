export type ItHelpDeskCommonIssues = {
  id?: number;
  name: {
    en: string;
    fr: string;
  };
};
export type ItHelpDeskCommonIssuesResponse = {
  data: ItHelpDeskCommonIssues[];
  total: number;
  page: number;
  limit: number;
};
