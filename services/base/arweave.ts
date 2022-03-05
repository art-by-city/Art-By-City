import { Context } from '@nuxt/types'
import Arweave from 'arweave'
import Transaction from 'arweave/web/lib/transaction'
import * as ArweaveUtils from 'arweave/web/lib/utils'

import { SignerFactory } from '~/factories'
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

  async sign(transaction: Transaction, manual: boolean = false): Promise<boolean> {
    try {
      if (!manual) {
        await this.$arweave.transactions.sign(transaction)
      } else {
        await this.signManually(transaction)
      }
    } catch (error) {
      error.message
        ? this.context.$toastService.error(error.message)
        : this.context.$toastService.error('Transaction rejected by User')

      return false
    }

    return true
  }

  private async signManually(tx: Transaction) {
    const signer = await SignerFactory.create()
    const owner = ArweaveUtils.bufferTob64(signer.publicKey)

    tx.setOwner(owner)
    const txSignatureData = await tx.getSignatureData()
    const rawSignature = await signer.sign(txSignatureData)
    const id = new Uint8Array(
      await window.crypto.subtle.digest('SHA-256', rawSignature)
    )
    tx.setSignature({
      id: ArweaveUtils.bufferTob64Url(id),
      owner,
      signature: ArweaveUtils.bufferTob64Url(rawSignature),
    })
  }
}


