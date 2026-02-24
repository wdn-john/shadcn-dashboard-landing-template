export type PaymentDTO = {
  installments: InstallmentDTO[];
};

export type InstallmentDTO = {
  id: number;
  expertPayoutAmount: number;
  expertPayoutAmountTransferStatus: InstallmentStatus;
};

export type InstallmentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
