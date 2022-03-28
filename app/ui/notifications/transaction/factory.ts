import { TransactionNotificationType, UserTransactionType } from '~/app/ui'
import {
  TransactionAcceptedNotification,
  TransactionConfirmedNotification,
  TransactionDroppedNotification,
  TransactionNotification,
  TransactionSubmittedNotification
} from '~/app/ui'
import { INotificationFactory } from '.'

export default class TransactionNotificationFactory
  implements INotificationFactory<TransactionNotification> {
  create(txType: UserTransactionType ,txId: string, type: TransactionNotificationType):
    TransactionNotification {
    switch (type) {
      case 'Submitted':
        return new TransactionSubmittedNotification(txType, txId)
      case 'Accepted':
        return new TransactionAcceptedNotification(txType, txId)
      case 'Dropped':
        return new TransactionDroppedNotification(txType, txId)
      case 'Confirmed':
        return new TransactionConfirmedNotification(txType, txId)
      default:
        throw new Error('TransactionNotificationType not supported')
    }
  }
}
