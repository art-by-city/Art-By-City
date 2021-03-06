import { Context } from '@nuxt/types'

import { ArDBService } from '.'
import { TransactionFactory } from '~/app/infra/arweave'

export default class TransactionService extends ArDBService {
  transactionFactory!: TransactionFactory

  constructor(context: Context) {
    super(context)
    this.transactionFactory = new TransactionFactory(
      this.$arweave,
      this.$ardb,
      context.$config.arweave.app
    )
  }
}
