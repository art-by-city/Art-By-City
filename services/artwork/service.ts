import Arweave from 'arweave'
import ArDB from '@textury/ardb'
import { Context } from '@nuxt/types'

import { Artwork, FeedItem } from '~/types'
import { TransactionBuilder } from '~/builders'
import { uuidv4 } from '~/helpers'

export default class ArtworkService {
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

  async createArtwork(artwork: Artwork): Promise<Artwork | undefined> {
    const data = JSON.stringify({ ...artwork })
    const tags: { name: string, value: string }[] = []

    if (artwork.slug) {
      tags.push({ name: 'slug', value: artwork.slug })
    }

    const tx = await this.transactionBuilder.buildEntityTransaction(
      'artwork',
      data,
      tags
    )

    await this.$arweave.transactions.sign(tx)
    await this.$arweave.transactions.post(tx)

    const res = await this.$arweave.api.get(tx.id)
    res.data.id = tx.id

    return res.data
  }

  async fetchArtworkFeed(creator?: string): Promise<FeedItem[]> {
    const items: FeedItem[] = []

    const txs = await this.transactionBuilder
      .searchTransactions('artwork', { owner: creator })

    for (const ardbTx of txs) {
      const res = await this.$arweave.api.get(ardbTx.id)
      const tx = await this.$arweave.transactions.get(ardbTx.id)

      res.data.id = tx.id

      items.push({ tx, artwork: res.data, guid: uuidv4() })
    }

    return items
  }
}
