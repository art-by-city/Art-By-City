import Transaction from 'arweave/node/lib/transaction'
import { DomainEntityCategory } from '../common'

export type UserTransactionType = DomainEntityCategory

export const processingStatuses = [
  'PENDING_SUBMISSION',
  'PENDING_CONFIRMATION',
  'DROPPED',
  'CONFIRMING'
] as const

export type ProcessingUserTransactionStatus =
  typeof processingStatuses[number]

export function isProcessing(status: string):
  status is ProcessingUserTransactionStatus {
  return processingStatuses.includes(status as ProcessingUserTransactionStatus)
}

export type UserTransactionStatus =
  | ProcessingUserTransactionStatus
  | 'CONFIRMED'

export interface CreateUserTransactionPayload {
  type: UserTransactionType
  transaction: Transaction
}

export interface UserTransaction extends CreateUserTransactionPayload {
  status: UserTransactionStatus
  confirmations?: number
  created: number
}

export interface SetUserTransactionStatusPayload {
  id: string
  status: UserTransactionStatus
  type: UserTransactionType
  confirmations?: number
}
