import { Notification } from '~/models'
import { IFactory } from '~/factories'

export interface INotificationFactory<T extends Notification> extends IFactory<T> {}

export { default as TransactionNotificationFactory } from './transaction'
