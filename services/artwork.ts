import { Context } from '@nuxt/types'
import Transaction from 'arweave/node/lib/transaction'
import { Bundle, DataItem } from 'arbundles'

import { Artwork, FeedItem } from '~/types'
import { uuidv4 } from '~/helpers'
import { TransactionService, LikesService } from './'
import { ArtworkFactory, BundleFactory } from '../factories'
import { LIKED_ENTITY_TAG } from './likes'

export default class ArtworkService extends TransactionService {
  $likesService!: LikesService

  constructor(context: Context) {
    super(context)

    this.$likesService = context.$likesService
  }

  async createArtworkTransaction(artwork: Artwork): Promise<Transaction> {
    const manifest: Partial<Artwork> = { ...artwork }

    delete manifest.id
    delete manifest.hashtags
    manifest.published = new Date()
    if (manifest.city) {
      manifest.city = manifest.city.toLowerCase()
    }
    if (!manifest.images) {
      manifest.images = []
    }
    const tags: { tag: string, value: string }[] = [
      { tag: 'Bundle-Format', value: 'binary' },
      { tag: 'Bundle-Version', value: '2.0.0' }
    ]
    if (artwork.slug) {
      tags.push({ tag: 'slug', value: artwork.slug })
    }

    const imageDataItems: DataItem[] = []
    for (let i = 0; i < artwork.images.length; i++) {
      const image = artwork.images[i]
      const data = JSON.stringify({ src: image.dataUrl })
      const dataItem = await this.createAndSignDataItem(
        data,
        [{ name: 'Content-Type', value: 'application/json'/*image.imageType*/ }]
      )
      imageDataItems.push(dataItem)
      manifest.images[i] = {
        guid: uuidv4(),
        dataUrl: imageDataItems[i].id,
        imageType: artwork.images[0].imageType
      }
    }

    const manifestDataItem = await this.createAndSignDataItem(
      JSON.stringify(manifest)
    )

    const dataItems = [ manifestDataItem, ...imageDataItems ]

    for (let i = 0; i < dataItems.length; i++) {
      const dataItem = dataItems[i]
      console.log('data item id', dataItem.id, dataItem.signature)
    }

    const bundle = await BundleFactory.create(dataItems)

    const tx = await this.transactionFactory.buildEntityTransaction(
      'artwork',
      bundle.getRaw(),
      tags
    )

    return tx
  }

  async fetchByTxIdOrSlug(txIdOrSlug: string, owner: string):
    Promise<Artwork | null> {
    const result = await this.transactionFactory.searchTransactions(
      'artwork',
      owner,
      {
        // type: 'application/json',
        sort: 'HEIGHT_DESC',
        tags: [{ tag: 'slug', value: txIdOrSlug }]
      }
    )

    console.log('artwork service fetch result', result.transactions.length)

    if (result.transactions[0]) {
      // return await this.fetch(result.transactions[0].id)
      return await this.fetchBundle(result.transactions[0].id)
    }

    // If no slug matches, try treating it as a txid
    return txIdOrSlug.length === 43
      ? await this.fetch(txIdOrSlug)
      : null
  }

  async fetchBundle(id: string): Promise<null> {
    console.log(`ArtworkService->fetchBundle(${id})`)

    const data = await this.$arweave.transactions.getData(id, { decode: true }) as Uint8Array
    console.log('ArtworkService->fetchBundle() data.length', data.length, data.byteLength)
    const buffer = Buffer.from(data)
    const bundle = new Bundle(buffer)
    console.log('ArtworkService->fetchBundle() bundle txIds', bundle.getIds())

    return null
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

  async fetchFeed(
    creator?: string | string[] | null,
    cursor?: string,
    limit?: number
  ): Promise<FeedItem[]> {
    if (!creator) {
      switch (this.config.app.name) {
        case 'ArtByCity':
          creator = [
            'mKRPxOSIe08BddCnrL9en8C3hUGqwA5l1sUZilGsjDg',
            'zIe2L7WAptLeDdDUcGPOFtBkItZuRE2wE2GQh2LfFqc',
            'hyL5aEp4K7fd7hYEjKxi6caxjyL2UANONOnnnFe7jwc',
            'aJIPwBoPqt1FGaa4pRoMotuDZr68PHRAoXe3lUerFTs',
            '1KZdIq1mkiTjb1gf6f5c__MUkheFyU6UK8-MMciSKnE',
            'dYRuag6nzcdFXJ02_Ljf8ks-WDUrpAMeSI0agFd_ZBQ',
            '276ituk07Igo0QzT5sa_ISRXwp04T5RfzBwZHS808h4',
            '0EeHrLUiUepAW3IZ8ZrNRu8bxEOlumouTdMYKBPPPTM',
            '1cX5WcLKn2kPWmiXPKbRIPpAWm5YP9H1172HpkYN1QI',
            'qoFt_qa74r8rPAIeZVd7wJUdQwLi8_7NvDOxs1dWf3c',
            'A2JEmT4LTk5WeBUFRGESX07OR-FUbtqfdBlBl8ooB64',
            'k4fkc6NDiMmfVR06qX5P5XvAOlLi9J9fgBaa8pLvIBc',
            '6uzZ2xVslWpFib3BR-J731uogU-FRuKDUifFVRZq8xE',
            'CxuvfybNxiEPpXGqIbM7tzzdSYOlOW9VOUWkf0FWH4c',
            '9XaFpHnpswVxZ7juWnG5iK9tYocYG_EYRf9WRmzbfCQ'
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
            '1KZdIq1mkiTjb1gf6f5c__MUkheFyU6UK8-MMciSKnE',
            'dYRuag6nzcdFXJ02_Ljf8ks-WDUrpAMeSI0agFd_ZBQ'
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

    const result = await this.transactionFactory.searchTransactions(
      'artwork',
      creator,
      {
        type: 'application/json',
        sort: 'HEIGHT_DESC',
        tags: [],
        limit: limit || 9,
        cursor
      }
    )

    return this.buildFeed(result.transactions.map(tx => tx.id), result.cursor)
  }

  async fetchLikedArtworkFeed(address: string, cursor?: string):
    Promise<FeedItem[]> {
    const result = await this.$likesService.fetchUserLikes(address, cursor, 9)

    const likedEntityTxIds = result.transactions.map(tx => {
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

    return this.buildFeed(likedEntityTxIds, result.cursor)
  }

  private buildFeed(txs: string[], cursor: string): FeedItem[] {
    return txs.map((txId) => {
      const item = { guid: uuidv4(), category: 'artwork', txId, cursor }
      return item as FeedItem
    })
  }
}
