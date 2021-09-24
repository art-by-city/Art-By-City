import { TransactionNotificationType, UserTransactionType } from '~/types'
import Notification from '../notification'

export default class TransactionNotification extends Notification {
  txId!: string
  txType!: UserTransactionType

  constructor(
    opts: {
      txType: UserTransactionType,
      txId: string,
      type: TransactionNotificationType,
      explanation: string
    }
  ) {
    super(opts.type)

    this.txType = opts.txType
    this.txId = opts.txId
    this.message = `
      Your <strong>${opts.txType}</strong> transaction has been
      <strong>${opts.type}</strong> ${opts.explanation}
    `.trim()
  }
}
