enum BudgetOption {
  HOURLY = 'HOURLY',
  FIXED = 'FIXED',
  PROJECT = 'PROJECT',
}

enum RequestStatus {
  OPEN = 'OPEN',
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
}

type AddressSearchCriteria = {
  // Note: The actual structure would need to be based on the AddressSearchCriteria class
  // which isn't shown in the provided code
};

export type ServiceRequestSearchCriteria = {
  issue?: string;
  description?: string;
  category?: string;
  status?: string;
  //budgetOption?: BudgetOption;
  minBudget?: number;
  maxBudget?: number;
  createdAfter?: string; // ISO DateTime string
  createdBefore?: string; // ISO DateTime string
  address?: AddressSearchCriteria;
};
