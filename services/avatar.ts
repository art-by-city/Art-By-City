import Transaction from 'arweave/node/lib/transaction'

import { Avatar } from '~/types'
import { TransactionService } from './'

export default class AvatarService extends TransactionService {
  async createAvatarTransaction(avatar: Avatar): Promise<Transaction> {
    const data = JSON.stringify({ ...avatar })

    const tx = await this.transactionFactory.buildEntityTransaction(
      'avatar',
      data
    )

    return tx
  }

  async fetchAvatar(address: string): Promise<Avatar | null> {
    const txs = await this.transactionFactory.searchTransactions(
      'avatar',
      address
    )

    if (txs[0]) {
      const res = await this.$arweave.api.get(txs[0].id)

      return res.data as Avatar
    }

    return null
  }
}
