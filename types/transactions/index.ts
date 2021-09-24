import Transaction from 'arweave/node/lib/transaction'
import { DomainEntityCategory } from '../common'

export type UserTransactionType =
  | DomainEntityCategory

export type UserTransactionStatus =
  | 'PENDING_SUBMISSION'
  | 'PENDING_CONFIRMATION'
  | 'DROPPED'
  | 'CONFIRMING'
  | 'CONFIRMED'

export interface CreateUserTransactionPayload {
  type: UserTransactionType
  transaction: Transaction
}

export interface UserTransaction extends CreateUserTransactionPayload {
  status: UserTransactionStatus
  confirmations?: number
  updated?: string
}

export interface SetUserTransactionStatusPayload {
  id: string
  status: UserTransactionStatus
  type: UserTransactionType
  confirmations?: number
}
