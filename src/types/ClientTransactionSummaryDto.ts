export type ClientTransactionSummaryDto = {
  id: number;
  requestName: string;
  platformFee: number;
  platformTps: number;
  platformTvq: number;
  platformTotal: number;
  servicePrice: number;
  serviceTps: number;
  serviceTvq: number;
  checkoutTps: number;
  checkoutTvq: number;
  checkoutTotal: number;
  remainingAmount: number;
};
