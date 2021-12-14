import { Context } from '@nuxt/types'
import Transaction from 'arweave/node/lib/transaction'

import { Artwork, DataURLArtworkImage, FeedItem } from '~/types'
import { uuidv4 } from '~/helpers'
import { TransactionService, LikesService } from './'
import { ArtworkFactory } from '../factories'
import { LIKED_ENTITY_TAG } from './likes'

export default class ArtworkService extends TransactionService {
  $likesService!: LikesService

  constructor(context: Context) {
    super(context)

    this.$likesService = context.$likesService
  }

  async createArtworkTransaction(artwork: Artwork): Promise<Transaction> {
    const artworkData: Partial<Artwork> = { ...artwork }

    delete artworkData.id
    delete artworkData.hashtags

    if (artworkData.images) {
      (artworkData.images as Partial<DataURLArtworkImage>[]).forEach(image => {
        delete image.guid
      })
    }

    artworkData.published = new Date()

    if (artworkData.city) {
      artworkData.city = artworkData.city.toLowerCase()
    }

    const jsonData = JSON.stringify(artworkData)
    const tags: { tag: string, value: string }[] = []

    if (artwork.slug) {
      tags.push({ tag: 'slug', value: artwork.slug })
    }

    const tx = await this.transactionFactory.buildEntityTransaction(
      'artwork',
      jsonData,
      tags
    )

    return tx
  }

  async fetchByTxIdOrSlug(txIdOrSlug: string, owner: string):
    Promise<Artwork | null> {
    const txsBySlug = await this.transactionFactory.searchTransactions(
      'artwork',
      owner,
      {
        type: 'application/json',
        sort: 'HEIGHT_DESC',
        tags: [{ tag: 'slug', value: txIdOrSlug }]
      }
    )

    if (txsBySlug[0]) {
      return await this.fetch(txsBySlug[0].id)
    }

    // If no slug matches, try treating it as a txid
    return await this.fetch(txIdOrSlug)
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
    if (!creator) {
      switch (this.config.name) {
        case 'ArtByCity':
          creator = [
            'mKRPxOSIe08BddCnrL9en8C3hUGqwA5l1sUZilGsjDg',
            'zIe2L7WAptLeDdDUcGPOFtBkItZuRE2wE2GQh2LfFqc',
            'hyL5aEp4K7fd7hYEjKxi6caxjyL2UANONOnnnFe7jwc',
            'aJIPwBoPqt1FGaa4pRoMotuDZr68PHRAoXe3lUerFTs',
            '1KZdIq1mkiTjb1gf6f5c__MUkheFyU6UK8-MMciSKnE'
          ]
          break
        case 'ArtByCity-Staging':
          creator = [
            'x3GW6wfBZ3wHTflETInuzJ5rOv_6JvlFi-dl6yYAr8Y',
            '07x1amh71n9OSHVbuZ4GRTrZSkJ9ZYkevGuXy70HJB4',
            'uc8wFvl6oJO0QymalfxFFCTLkdl2HmF9xQrWvzk8uXM',
            'LtILfPM8agd7RU6AaQmwh0SFEvxPu-tb06E_iHksvUM',
            'P9TlkKY8NEuiBWf-YGIcVV9ZVWjhh9WgtoM8ej8jhJ8',
            'lULoyhunyPeZGVrZnDnTfDBxS-XOFV-qaNphiwPH2Ps',

            'mKRPxOSIe08BddCnrL9en8C3hUGqwA5l1sUZilGsjDg',
            'zIe2L7WAptLeDdDUcGPOFtBkItZuRE2wE2GQh2LfFqc',
            'hyL5aEp4K7fd7hYEjKxi6caxjyL2UANONOnnnFe7jwc',
            'aJIPwBoPqt1FGaa4pRoMotuDZr68PHRAoXe3lUerFTs',
            '1KZdIq1mkiTjb1gf6f5c__MUkheFyU6UK8-MMciSKnE'
          ]
          break
        default:
          creator = [
            'MlV6DeOtRmakDOf6vgOBlif795tcWimgyPsYYNQ8q1Y',

            'mKRPxOSIe08BddCnrL9en8C3hUGqwA5l1sUZilGsjDg',
            'zIe2L7WAptLeDdDUcGPOFtBkItZuRE2wE2GQh2LfFqc',
            'hyL5aEp4K7fd7hYEjKxi6caxjyL2UANONOnnnFe7jwc',
            'aJIPwBoPqt1FGaa4pRoMotuDZr68PHRAoXe3lUerFTs',
            '1KZdIq1mkiTjb1gf6f5c__MUkheFyU6UK8-MMciSKnE'
          ]
      }
    }

    const txs = await this.transactionFactory.searchTransactions(
      'artwork',
      creator
    )

    return this.buildFeed(txs.map(tx => tx.id))
  }

  async fetchLikedArtworkFeed(address: string): Promise<FeedItem[]> {
    const items: FeedItem[] = []
    const likeTxs = await this.$likesService.fetchUserLikes(address)

    const likedEntityTxIds = likeTxs.map(tx => {
      try {
        const tags: { name: string, value: string }[] = (tx as any)._tags
        const likedEntityTag = tags.find((tag) => tag.name === LIKED_ENTITY_TAG)

        if (likedEntityTag) {
          return likedEntityTag.value
        }

        return ''
      } catch (err) {
        return ''
      }
    }).filter(txId => !!txId)

    return this.buildFeed(likedEntityTxIds)
  }

  private buildFeed(txIds: string[]): FeedItem[] {
    return txIds.map(txId => {
      return { guid: uuidv4(), txId, category: 'artwork' }
    })
  }
}
