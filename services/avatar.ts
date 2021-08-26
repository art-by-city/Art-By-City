import Arweave from 'arweave'
import ArDB from '@textury/ardb'
import { Context } from '@nuxt/types'

import { TransactionBuilder } from '~/builders'
import { Avatar } from '~/types'

export default class AvatarService {
  $arweave!: Arweave
  $ardb!: ArDB
  transactionBuilder!: TransactionBuilder

  constructor(context: Context) {
    this.$arweave = context.$arweave
    this.$ardb = context.$ardb
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
}
