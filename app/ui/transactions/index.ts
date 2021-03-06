import { DomainEntityCategory } from '../../core/common'

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
  id: string
  last_tx: string
  target?: string
  entityId?: string
}

export interface UserTransaction extends CreateUserTransactionPayload {
  status: UserTransactionStatus
  confirmations?: number
  created: number // time
  lastSubmission?: number // time
}

export interface SetUserTransactionStatusPayload {
  id: string
  status: UserTransactionStatus
  type: UserTransactionType
  confirmations?: number
  lastSubmission?: number
}
