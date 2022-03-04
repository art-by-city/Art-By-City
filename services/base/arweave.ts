import { Context } from '@nuxt/types'
import Arweave from 'arweave'
import Transaction from 'arweave/web/lib/transaction'


import { ArweaveConfig } from '~/types'

export default class ArweaveService {
  $arweave!: Arweave
  config!: ArweaveConfig
  context: Context

  constructor(context: Context) {
    this.$arweave = context.$arweave
    this.config = context.$config.arweave
    this.context = context
  }

  async sign(transaction: Transaction): Promise<boolean> {
    try {
      await this.$arweave.transactions.sign(transaction)
    } catch (error) {
      error.message
        ? this.context.$toastService.error(error.message)
        : this.context.$toastService.error('Transaction rejected by User')

      return false
    }

    return true
  }
}


