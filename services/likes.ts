import ArdbTransaction from 'ardb/lib/models/transaction'
import Transaction from 'arweave/node/lib/transaction'
import _ from 'lodash'

import { TransactionService } from './'
import { TransactionSearchResults } from '~/factories/transaction'
import { FeedItem, LikeWithTip } from '~/types'
import { uuidv4 } from '~/helpers'

export const LIKED_ENTITY_TAG = 'liked-entity'
export const LIKING_ARTIST_FEE = '0.0002' // AR

export default class LikesService extends TransactionService {
  cache: {
    userLikes: {
      [address: string]: {
        [cursor: string]: TransactionSearchResults
      }
    },
    entityLikes: {
      [entityId: string]: ArdbTransaction[]
    },
    entityLikedBy: {
      [entityId: string]: {
        [address: string]: boolean
      }
    },
    receivedLikes: {
      [address: string]: ArdbTransaction[]
    }
  } = {
    userLikes: {},
    entityLikes: {},
    entityLikedBy: {},
    receivedLikes: {}
  }

  async createLikeTransaction(
    likedEntityTxId: string,
    likedEntityOwner: string,
    likeTip: string = LIKING_ARTIST_FEE
  ): Promise<Transaction> {
    const tx = await this.transactionFactory.buildEntityTransaction(
      'like',
      undefined,
      [{ tag: LIKED_ENTITY_TAG, value: likedEntityTxId }],
      likedEntityOwner,
      likeTip
    )

    return tx
  }

  async isEntityLikedBy(
    entityTxId: string,
    address: string,
    force: boolean = false
  ): Promise<boolean> {
    if (
      force
      || !this.cache.entityLikedBy[entityTxId]
      || !this.cache.entityLikedBy[entityTxId][address]
    ) {
      const result = await this.transactionFactory.searchTransactions(
        'like',
        address,
        {
          tags: [{ tag: LIKED_ENTITY_TAG, value: entityTxId }]
        }
      )

      if (result.transactions.length > 0) {
        if (!this.cache.entityLikedBy[entityTxId]) {
          this.cache.entityLikedBy[entityTxId] = {}
        }
        this.cache.entityLikedBy[entityTxId][address] = true
      }
    }

    return (
      this.cache.entityLikedBy[entityTxId]
      && this.cache.entityLikedBy[entityTxId][address]
    ) || false
  }

  private async fetchEntityLikeTxs(
    entityTxId: string,
    entityOwner: string,
    force: boolean = false
  ): Promise<ArdbTransaction[]> {
    if (force || !this.cache.entityLikes[entityTxId]) {
      const result = await this.transactionFactory.searchTransactions(
        'like',
        undefined,
        {
          tags: [{ tag: LIKED_ENTITY_TAG, value: entityTxId }],
          limit: 100
        }
      )

      // Remove self-likes
      result.transactions = result.transactions.filter(
        tx => tx.owner.address !== entityOwner
      )

      // Ensure likes are unique by likedBy address
      result.transactions = _.uniqBy(result.transactions, 'owner.address')

      this.cache.entityLikes[entityTxId] = result.transactions
    }

    return this.cache.entityLikes[entityTxId] || []
  }

  async fetchLikedBy(
    entityTxId: string,
    entityOwner: string
  ): Promise<(FeedItem & LikeWithTip)[]> {
    return (
      await this.fetchEntityLikeTxs(entityTxId, entityOwner)
    ).map((tx) => {
      return {
        from: tx.owner.address,
        amount: tx.quantity.winston,
        txId: tx.id,
        guid: uuidv4(),
        cursor: '',
        category: 'like',
        timestamp: tx.block.timestamp,
        entityTxId
      }
    })
  }

  async fetchTotalLikes(
    entityTxId: string,
    entityOwner: string
  ): Promise<number> {
    return (await this.fetchEntityLikeTxs(entityTxId, entityOwner)).length || 0
  }

  async fetchUserLikes(
    address: string,
    cursor?: string,
    force: boolean = false,
    limit: number = 100
  ): Promise<TransactionSearchResults> {
    if (
      force
      || !this.cache.userLikes[address]
      || !this.cache.userLikes[address][cursor || '']
    ) {
      const result = await this.transactionFactory.searchTransactions(
        'like',
        address,
        {
          sort: 'HEIGHT_DESC',
          tags: [],
          cursor,
          limit
        }
      )

      // Filter out self-likes
      result.transactions = result.transactions.filter(
        tx => tx.recipient !== address
      )

      // Ensure likes are for unique entity tx
      result.transactions = _.uniqWith(result.transactions, (txA, txB) => {
        const entityIdA = txA.tags.find((tag) => LIKED_ENTITY_TAG === tag.name)
        const entityIdB = txB.tags.find((tag) => LIKED_ENTITY_TAG === tag.name)

        return !entityIdA || !entityIdB || _.isEqual(entityIdA, entityIdB)
      })

      if (!this.cache.userLikes[address]) {
        this.cache.userLikes[address] = {}
      }
      this.cache.userLikes[address][cursor || ''] = result
    }

    return this.cache.userLikes[address][cursor || '']
      || { cursor: '', transactions: [] }
  }

  async fetchTotalLikedByUser(address: string): Promise<number> {
    return (
      await this.fetchUserLikes(address)
    ).transactions.length || 0
  }

  async fetchAllLikesReceived(
    address: string
  ): Promise<(FeedItem & LikeWithTip)[]> {
    const { transactions } = await this.transactionFactory.searchTransactions(
      'like',
      undefined,
      {
        tags: [],
        limit: 'all',
        to: address,
        sort: 'HEIGHT_DESC'
      }
    )

    return transactions.map(tx => {
      const tag = tx.tags.find((tag) => tag.name === LIKED_ENTITY_TAG)

      return {
        from: tx.owner.address,
        amount: tx.quantity.winston,
        txId: tx.id,
        guid: uuidv4(),
        category: 'like',
        timestamp: tx.block.timestamp,
        entityTxId: tag?.value || ''
      }
    })
  }
}
