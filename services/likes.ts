import ArdbTransaction from 'ardb/lib/models/transaction'
import Transaction from 'arweave/node/lib/transaction'
import _ from 'lodash'

import { TransactionService } from './'
import { TransactionSearchResults } from '~/factories/transaction'

export const LIKED_ENTITY_TAG = 'liked-entity'
export const LIKING_ARTIST_FEE = '0.0002' // AR

export default class LikesService extends TransactionService {
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

  async isEntityLikedBy(entityTxId: string, address: string): Promise<boolean> {
    const result = await this.transactionFactory.searchTransactions(
      'like',
      address,
      {
        tags: [{ tag: LIKED_ENTITY_TAG, value: entityTxId }]
      }
    )

    return result.transactions.length > 0
  }

  private async fetchEntityLikeTxs(
    entityTxId: string,
    entityOwner: string
  ): Promise<ArdbTransaction[]> {
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

    return result.transactions
  }

  async fetchLikedBy(
    entityTxId: string,
    entityOwner: string
  ): Promise<{
      address: string,
      amount: string,
      txId: string
    }[]> {
    return (
      await this.fetchEntityLikeTxs(entityTxId, entityOwner)
    ).map((tx) => { return {
      address: tx.owner.address,
      amount: tx.quantity.winston,
      txId: tx.id
    } })
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
    limit: number = 100
  ): Promise<TransactionSearchResults> {
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

    return result
  }

  async fetchTotalLikedByUser(address: string): Promise<number> {
    return (
      await this.fetchUserLikes(address, undefined, 100)
    ).transactions.length || 0
  }
}
