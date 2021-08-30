import Arweave from 'arweave'
import ArDB from '@textury/ardb'
import { Context } from '@nuxt/types'

import { TransactionBuilder } from '~/builders'
import { Avatar } from '~/types'
import { ArDBService } from './'

export default class AvatarService extends ArDBService {
  transactionBuilder!: TransactionBuilder

  constructor(context: Context) {
    super(context)
    this.transactionBuilder = new TransactionBuilder(
      this.$arweave,
      this.$ardb,
      context.$config.arweave.appConfig
    )
  }

  async uploadAvatar(avatar: Avatar): Promise<Avatar | undefined> {
    const data = JSON.stringify({ ...avatar })

    const tx = await this.transactionBuilder.buildEntityTransaction(
      'avatar',
      data
    )

    await this.$arweave.transactions.sign(tx)
    await this.$arweave.transactions.post(tx)

    const res = await this.$arweave.api.get(tx.id)
    res.data.id = tx.id

    return res.data as Avatar
  }

  async fetchAvatar(address: string): Promise<Avatar | undefined> {
    const txs = await this.transactionBuilder.searchTransactions(
      'avatar',
      address
    )

    if (txs[0]) {
      const res = await this.$arweave.api.get(txs[0].id)

      return res.data as Avatar
    }

    return
  }
}
