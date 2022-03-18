import ArdbTransaction from '@textury/ardb/lib/models/transaction'
import Transaction from 'arweave/node/lib/transaction'

import { TransactionService } from './'
import { User } from '~/models'
import { TransactionSearchResults } from '../factories/transaction'
import _ from 'lodash'

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

  async isEntityLikedBy(entityTxId: string, likedBy: string): Promise<boolean> {
    const result = await this.transactionFactory.searchTransactions(
      'like',
      likedBy,
      {
        tags: [{ tag: LIKED_ENTITY_TAG, value: entityTxId }]
      }
    )

    return result.transactions.length > 0
  }

  private async fetchEntityLikeTxs(
    entityTxId: string
  ): Promise<ArdbTransaction[]> {
    const result = await this.transactionFactory.searchTransactions(
      'like',
      undefined,
      {
        tags: [{ tag: LIKED_ENTITY_TAG, value: entityTxId }]
      }
    )

    // Ensure likes are unique by likedBy address
    result.transactions = _.uniqBy(result.transactions, 'owner.address')

    return result.transactions
  }

  async fetchLikedBy(
    entityTxId: string
  ): Promise<{
      address: string,
      amount: string,
      txId: string
    }[]> {
    return (
      await this.fetchEntityLikeTxs(entityTxId)
    ).map((tx) => { return {
      address: tx.owner.address,
      amount: tx.quantity.winston,
      txId: tx.id
    } })
  }

  async fetchTotalLikes(entityTxId: string): Promise<number> {
    return (await this.fetchEntityLikeTxs(entityTxId)).length || 0
  }

  async fetchUserLikes(likedBy: string, cursor?: string, limit?: number):
    Promise<TransactionSearchResults> {
    const result = await this.transactionFactory.searchTransactions(
      'like',
      likedBy,
      {
        sort: 'HEIGHT_DESC',
        tags: [],
        cursor,
        limit
      }
    )

    // Ensure likes are for unique entity tx
    result.transactions = _.uniqWith(result.transactions, (txA, txB) => {
      const tagsA: { name: string, value: string }[] = (txA as any)._tags
      const entityIdA = tagsA.find((tag) => LIKED_ENTITY_TAG === tag.name)
      const tagsB: { name: string, value: string }[] = (txB as any)._tags
      const entityIdB = tagsB.find((tag) => LIKED_ENTITY_TAG === tag.name)

      return !entityIdA || !entityIdB || _.isEqual(entityIdA, entityIdB)
    })

    return result
  }

  async fetchTotalLikedByUser(likedBy: string): Promise<number> {
    return (
      await this.fetchUserLikes(likedBy, undefined, 100)
    ).transactions.length || 0
  }
}
