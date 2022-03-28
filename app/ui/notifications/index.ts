export type NotificationType = TransactionNotificationType

export type TransactionNotificationType =
  | 'Submitted'
  | 'Accepted'
  | 'Dropped'
  | 'Confirmed'

export interface MarkNotificationsReadPayload {
  readtime: number
}

export { default as Notification } from './notification'
export * from './transaction'
