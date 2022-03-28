import { Notification } from '~/app/ui'

export { default as TransactionNotification } from './transaction'
export { default as TransactionSubmittedNotification }
  from './transactionSubmitted'
export { default as TransactionAcceptedNotification }
  from './transactionAccepted'
export { default as TransactionDroppedNotification }
  from'./transactionDropped'
export { default as TransactionConfirmedNotification }
  from './transactionConfirmed'

export interface IFactory<T> {
  create(...args: any): T
}

export interface INotificationFactory<
  T extends Notification
> extends IFactory<T> {}

export { default as TransactionNotificationFactory } from './factory'
