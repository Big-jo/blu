export const TransactionStatuses = ['SUCCESS', 'FAILED', 'PENDING'] as const;
export type TransactionStatus = (typeof TransactionStatuses)[number];

export enum TRANSACTION_TYPES {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum ORDER {
  ASC = 'ASC',
  DESC = 'DESC',
}