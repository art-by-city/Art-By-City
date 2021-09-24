import { UserTransactionType } from '~/types'
import TransactionNotification from './transaction'

export default class TransactionAccepted extends TransactionNotification {
  constructor(txType: UserTransactionType, txId: string) {
    super({
      txType,
      txId,
      type: 'Accepted',
      explanation: 'by the Arweave network and is awaiting confirmation'
    })
  }
}
