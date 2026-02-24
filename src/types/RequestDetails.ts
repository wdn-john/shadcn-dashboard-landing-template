import { RequestAddress } from "./RequestAddress";

export type RequestDetails = {
  id?: number;
  issue: string;
  description: string;
  priority: string;
  workLocation: string;
  locationOption?: string;
  location?: string;
  budgetOption: string;
  budget: string;
  additionalBudgetInfo?: string;
  latitude?: number | null;
  longitude?: number | null;
  status: string;
  address?: RequestAddress;
};

export type FormRequestDetails = {
  issue: string;
  description: string;
  priority: string;
  work_location: string;
  location_option: string;
  location: string;
  entered_address: string;
  budget_option: string;
  budget: string;
  additional_budget_info: string;
  latitude: number | null;
  longitude: number | null;
};