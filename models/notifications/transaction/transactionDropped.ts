import { UserTransactionType } from '~/types'
import TransactionNotification from './transaction'

export default class TransactionDropped extends TransactionNotification {
  constructor(txType: UserTransactionType, txId: string) {
    super({
      txType,
      txId,
      type: 'Dropped',
      explanation: 'from the Arweave network and should be re-submitted'
    })
  }
}
