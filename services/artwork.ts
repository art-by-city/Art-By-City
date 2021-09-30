import Transaction from 'arweave/node/lib/transaction'

import { TransactionService } from '.'
import { Artwork, FeedItem } from '~/types'
import { uuidv4 } from '~/helpers'

export default class ArtworkService extends TransactionService {
  async createArtworkTransaction(artwork: Artwork): Promise<Transaction> {
    const data = JSON.stringify({ ...artwork })
    const tags: { name: string, value: string }[] = []

    if (artwork.slug) {
      tags.push({ name: 'slug', value: artwork.slug })
    }

    const tx = await this.transactionFactory.buildEntityTransaction(
      'artwork',
      data,
      tags
    )

    return tx
  }

  async resolveSlug(owner: string, slug: string): Promise<string> {
    const txs = await this.transactionFactory.searchTransactions('artwork', owner)

    return 'fake-tx-id'
  }

  async fetchArtworkFeed(creator?: string | string[]): Promise<FeedItem[]> {
    const items: FeedItem[] = []

    if (!creator) {
      switch (this.config.name) {
        case 'ArtByCity':
          creator = []
          break
        case 'ArtByCity-Staging':
          creator = [
            'x3GW6wfBZ3wHTflETInuzJ5rOv_6JvlFi-dl6yYAr8Y',
            '07x1amh71n9OSHVbuZ4GRTrZSkJ9ZYkevGuXy70HJB4',
            'uc8wFvl6oJO0QymalfxFFCTLkdl2HmF9xQrWvzk8uXM'
          ]
          break
        default:
          creator = [
            'MlV6DeOtRmakDOf6vgOBlif795tcWimgyPsYYNQ8q1Y' // TestWeave :)
          ]
      }
    }

    const txs = await this.transactionFactory
      .searchTransactions('artwork', creator)

    for (const ardbTx of txs) {
      const res = await this.$arweave.api.get(ardbTx.id)
      const tx = await this.$arweave.transactions.get(ardbTx.id)

      if (res.data) {
        res.data.id = tx.id

        items.push({ tx, artwork: res.data, guid: uuidv4() })
      }
    }

    return items
  }
}
