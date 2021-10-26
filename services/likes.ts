import ArdbTransaction from '@textury/ardb/lib/models/transaction'
import Transaction from 'arweave/node/lib/transaction'

import { TransactionService } from './'
import { User } from '~/models'

export const LIKED_ENTITY_TAG = 'liked-entity'
const LIKING_ARTIST_FEE = '0.0002' // $0.01 USD @ 1AR/$50

export default class LikesService extends TransactionService {
  async createLikeTransaction(
    likedEntityTxId: string,
    likedEntityOwner: string
  ): Promise<Transaction> {
    const tx = await this.transactionFactory.buildEntityTransaction(
      'like',
      undefined,
      [{ tag: LIKED_ENTITY_TAG, value: likedEntityTxId }],
      likedEntityOwner,
      LIKING_ARTIST_FEE
    )

    return tx
  }

  async isEntityLikedBy(entityTxId: string, likedBy: string): Promise<boolean> {
    const txs = await this.transactionFactory.searchTransactions(
      'like',
      likedBy,
      {
        tags: [{ tag: LIKED_ENTITY_TAG, value: entityTxId }]
      }
    )

    if (txs[0]) {
      return true
    }

    return false
  }

  private async fetchEntityLikeTxs(
    entityTxId: string
  ): Promise<ArdbTransaction[]> {
    const txs = await this.transactionFactory.searchTransactions(
      'like',
      undefined,
      {
        tags: [{ tag: LIKED_ENTITY_TAG, value: entityTxId }]
      }
    )

    return txs
  }

  async fetchLikedBy(entityTxId: string): Promise<User[]> {
    return (
      await this.fetchEntityLikeTxs(entityTxId)
    ).map((tx) => { return { address: tx.owner.address } })
  }

  async fetchTotalLikes(entityTxId: string): Promise<number> {
    return (await this.fetchEntityLikeTxs(entityTxId)).length || 0
  }

  async fetchUserLikes(likedBy: string): Promise<ArdbTransaction[]> {
    const txs = await this.transactionFactory.searchTransactions(
      'like',
      likedBy,
      {
        sort: 'HEIGHT_DESC'
      }
    )

    return txs
  }

  async fetchTotalLikedByUser(likedBy: string): Promise<number> {
    return (await this.fetchUserLikes(likedBy)).length || 0
  }
}
