import { UserTransactionType } from '~/types'
import TransactionNotification from './transaction'

export default class TransactionSubmitted extends TransactionNotification {
  constructor(txType: UserTransactionType, txId: string) {
    super({
      txType,
      txId,
      type: 'Submitted',
      explanation: 'to the Arweave network'
    })
  }
}
