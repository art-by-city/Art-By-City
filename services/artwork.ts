import Transaction from 'arweave/node/lib/transaction'

import { Artwork, FeedItem } from '~/types'
import { uuidv4 } from '~/helpers'
import { TransactionService } from './'
import { ArtworkFactory } from '../factories'

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

  async fetch(id: string): Promise<Artwork | null> {
    try {
      const txDataString = await this.$arweave.transactions.getData(id, {
        decode: true,
        string: true
      }) as string

      const txData = JSON.parse(txDataString)
      txData.id = id

      const artwork = new ArtworkFactory().create(txData)

      return artwork
    } catch (error) {
      console.error(error)

      return null
    }
  }

  async fetchFeed(creator?: string | string[]): Promise<FeedItem[]> {
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
            'uc8wFvl6oJO0QymalfxFFCTLkdl2HmF9xQrWvzk8uXM',
            'LtILfPM8agd7RU6AaQmwh0SFEvxPu-tb06E_iHksvUM',
            'P9TlkKY8NEuiBWf-YGIcVV9ZVWjhh9WgtoM8ej8jhJ8',
            'lULoyhunyPeZGVrZnDnTfDBxS-XOFV-qaNphiwPH2Ps'
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
      const txId = ardbTx.id
      try {
        const txDataString = await this.$arweave.transactions.getData(txId, {
          decode: true,
          string: true
        }) as string

        const txData = JSON.parse(txDataString)
        txData.id = txId

        const artwork = new ArtworkFactory().create(txData)

        items.push({ guid: uuidv4(), artwork })
      } catch (error) {
        console.error(error)
      }
    }

    return items
  }
}
