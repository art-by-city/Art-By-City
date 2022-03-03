import { Context } from '@nuxt/types'
import Arweave from 'arweave'
import Transaction from 'arweave/web/lib/transaction'
import { createData, DataItem } from 'arbundles'
import { Signer } from 'arbundles/src/signing'
import { getSignatureData } from 'arbundles/src/ar-data-base'

import { ArweaveConfig } from '~/types'
import { SignerFactory } from '~/factories'

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

  async createAndSignDataItem(
    data: string | Uint8Array,
    tags?: { name: string, value: string }[]
  ): Promise<DataItem> {
    const signer = await SignerFactory.create()

    const dataItem = createData(data, signer, { tags })

    await signDataItem(dataItem, signer)

    return dataItem
  }
}

async function signDataItem(item: DataItem, signer: Signer): Promise<Buffer> {
  const { signature, id } = await getSignatureAndId(item, signer)

  item.getRaw().set(signature, 2)

  return id
}

async function getSignatureAndId(
  item: DataItem,
  signer: Signer,
): Promise<{ signature: Buffer; id: Buffer }> {
  const signatureData = await getSignatureData(item)
  const signatureBytes = await signer.sign(signatureData)
  const idBytes = await Arweave.crypto.hash(signatureBytes)

  return { signature: Buffer.from(signatureBytes), id: Buffer.from(idBytes) }
}
