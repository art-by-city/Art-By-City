import { Context } from '@nuxt/types'

import { ArDBService } from './'
import { TransactionBuilder } from '~/builders'

export default class TransactionService extends ArDBService {
  transactionBuilder!: TransactionBuilder

  constructor(context: Context) {
    super(context)
    this.transactionBuilder = new TransactionBuilder(
      this.$arweave,
      this.$ardb,
      context.$config.arweave.appConfig
    )
  }
}
