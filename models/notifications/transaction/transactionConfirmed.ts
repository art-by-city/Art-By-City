import { UserTransactionType } from '~/types'
import TransactionNotification from './transaction'

export default class TransactionConfirmed extends TransactionNotification {
  constructor(txType: UserTransactionType, txId: string) {
    super({
      txType,
      txId,
      type: 'Confirmed',
      explanation: 'by the Arweave network and is now permanent!'
    })
  }
}
