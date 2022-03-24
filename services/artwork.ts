import { Context } from '@nuxt/types'
import Transaction from 'arweave/node/lib/transaction'
import _ from 'lodash'

import {
  Artwork,
  ArtworkCreationOptions,
  FeedItem,
  LegacyArtwork
} from '~/types'
import { uuidv4 } from '~/helpers'
import { ArtworkFactory, ArtworkBundleFactory } from '~/factories'
import { LIKED_ENTITY_TAG } from './likes'
import { TransactionService, LikesService } from './'

const PAGE_SIZE = 9

export default class ArtworkService extends TransactionService {
  $likesService!: LikesService
  artworkBundleFactory!: ArtworkBundleFactory

  cache: {
    slugs: { [slug: string]: string }
    artwork: { [id: string]: Artwork | LegacyArtwork }
  } = { slugs: {}, artwork: {} }

  constructor(context: Context) {
    super(context)

    this.$likesService = context.$likesService
    this.artworkBundleFactory = new ArtworkBundleFactory(
      this.config.app.name,
      this.config.app.version
    )
  }

  async createArtworkTransaction(
    opts: ArtworkCreationOptions,
    logCb?: Function
  ): Promise<Transaction> {
    const {
      bundle,
      manifestId
    } = await this.artworkBundleFactory.create(opts, logCb)
    const data = bundle.getRaw()
    const tx = await this.$arweave.createTransaction({ data })
    tx.addTag('App-Name', this.config.app.name)
    tx.addTag('App-Version', this.config.app.version)
    tx.addTag('Bundle-Format', 'binary')
    tx.addTag('Bundle-Version', '2.0.0')
    tx.addTag('Category', 'artwork:bundle')
    tx.addTag('slug', opts.slug)
    tx.addTag('Manifest-ID', manifestId)

    return tx
  }

  async fetchByTxIdOrSlug(
    txIdOrSlug: string,
    owner: string
  ): Promise<Artwork | LegacyArtwork | null> {
    if (this.cache.slugs[txIdOrSlug]) {
      return await this.fetch(this.cache.slugs[txIdOrSlug])
    }

    const { transactions } = await this.transactionFactory.searchTransactions(
      'artwork:bundle',
      owner,
      {
        sort: 'HEIGHT_DESC',
        tags: [
          { tag: 'slug', value: txIdOrSlug },
          { tag: 'Bundle-Format', value: 'binary' },
          { tag: 'Bundle-Version', value: '2.0.0' }
        ]
      }
    )

    if (transactions[0]) {
      const tx = transactions[0]
      try {
        const manifestTag = tx.tags.find((tag) => tag.name === 'Manifest-ID')

        if (manifestTag) {
          this.cache.slugs[txIdOrSlug] = manifestTag.value

          return await this.fetch(manifestTag.value)
        }
      } catch (err) {}
    }

    const v0result = await this.transactionFactory.searchTransactions(
      'artwork',
      owner,
      {
        type: 'application/json',
        sort: 'HEIGHT_DESC',
        tags: [{ tag: 'slug', value: txIdOrSlug }]
      }
    )

    if (v0result.transactions[0]) {
      this.cache.slugs[txIdOrSlug] = v0result.transactions[0].id

      return await this.fetch(v0result.transactions[0].id)
    }

    // If no slug matches, try treating it as a txid
    return txIdOrSlug.length === 43
      ? await this.fetch(txIdOrSlug)
      : null
  }

  async fetch(id: string): Promise<Artwork | LegacyArtwork | null> {
    try {
      if (!this.cache.artwork[id]) {
        // NB: Use /gateway proxy for arweave.net to avoid CORS fails
        const res = await this.context.$axios.get(`/gateway/${id}`)

        const artwork = new ArtworkFactory().build(id, res.data)

        this.cache.artwork[id] = artwork
      }

      return this.cache.artwork[id]
    } catch (error) {
      console.error(error)

      return null
    }
  }

  async fetchFeed(
    creator?: string | string[] | null,
    cursor?: string,
    cursorV0?: string,
    limit: number = PAGE_SIZE
  ): Promise<{ cursor: string, cursorV0?: string, feed: FeedItem[]}> {
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
            '9XaFpHnpswVxZ7juWnG5iK9tYocYG_EYRf9WRmzbfCQ',
            '83cE_sKfvJ2XugWumQZPY8KU9PpWqC8P_CnItpJWXn4',
            'Qk6U75ZH_Wtwq5BsNSZK35eYq2lUZbVtP_qfif2JeZk',
          ]
          break
        case 'ArtByCity-Staging':
          creator = [
            'x3GW6wfBZ3wHTflETInuzJ5rOv_6JvlFi-dl6yYAr8Y',
            '07x1amh71n9OSHVbuZ4GRTrZSkJ9ZYkevGuXy70HJB4',
            'uc8wFvl6oJO0QymalfxFFCTLkdl2HmF9xQrWvzk8uXM',
            'LtILfPM8agd7RU6AaQmwh0SFEvxPu-tb06E_iHksvUM',
            'P9TlkKY8NEuiBWf-YGIcVV9ZVWjhh9WgtoM8ej8jhJ8',
            // 'lULoyhunyPeZGVrZnDnTfDBxS-XOFV-qaNphiwPH2Ps',

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

    const {
      transactions,
      cursor: nextCursor
    } = await this.transactionFactory.searchTransactions(
      ['artwork:bundle'],
      creator,
      {
        sort: 'HEIGHT_DESC',
        cursor,
        limit
      }
    )

    let nextCursorV0: string | undefined = undefined
    if (limit - transactions.length > 0) {
      // Search for v0 artwork (published before block #891282)
      const maxV0artworkBlockHeight = 891282
      const {
        transactions: transactionsV0,
        cursor: _nextCursorV0
      } = await this.transactionFactory.searchTransactions(
        ['artwork'],
        creator,
        {
          sort: 'HEIGHT_DESC',
          limit: 100, // There won't be many if we are using max block height
          cursor: cursorV0,
          max: maxV0artworkBlockHeight
        }
      )

      if (transactionsV0.length > 0) {
        nextCursorV0 = _nextCursorV0
        transactions.push(...transactionsV0)
      }

    }

    const txIds = _
      .chain(transactions)
      .map(tx => {
        try {
          const manifestTag = tx.tags.find((tag) => tag.name === 'Manifest-ID')

          if (manifestTag) {
            return manifestTag.value
          }

          return tx.id
        } catch (err) {
          return ''
        }
      })
      .filter(txId => !!txId)
      .uniq()
      .value()

    return {
      cursor: nextCursor || cursor || '',
      cursorV0: nextCursorV0 || cursorV0,
      feed: this.buildFeed(txIds)
    }
  }

  async fetchLikedArtworkFeed(
    address: string,
    cursor?: string
  ): Promise<{ cursor: string, feed: FeedItem[] }> {
    const {
      transactions,
      cursor: nextCursor
    } = await this.$likesService.fetchUserLikes(
      address,
      cursor,
      false,
      PAGE_SIZE
    )

    const likedEntityTxIds = transactions.map(tx => {
      try {
        const likedEntityTag = tx.tags.find(
          tag => tag.name === LIKED_ENTITY_TAG
        )

        if (likedEntityTag) {
          return likedEntityTag.value
        }

        return ''
      } catch (err) {
        return ''
      }
    }).filter(txId => !!txId)


    return {
      cursor: nextCursor,
      feed: this.buildFeed(likedEntityTxIds)
    }
  }

  private buildFeed(txs: string[]): FeedItem[] {
    return txs.map((txId) => {
      const item: FeedItem = {
        guid: uuidv4(),
        category: 'artwork',
        txId
      }

      return item
    })
  }
}
