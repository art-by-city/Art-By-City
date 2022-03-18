import ArdbTransaction from 'ardb/lib/models/transaction'
import Transaction from 'arweave/node/lib/transaction'

import { FeedItem, Tip } from '~/types'
import { uuidv4 } from '../helpers'
import { TransactionService } from './'

export default class TipsService extends TransactionService {
  async createTipTransaction(
    recipient: string,
    tip: Tip
  ): Promise<Transaction> {
    return await this.transactionFactory.buildEntityTransaction(
      'tip',
      undefined,
      [],
      recipient,
      tip.amount
    )
  }

  async fetchFeed(
    address: string,
    cursor?: string,
    limit: number = 20
  ): Promise<(FeedItem & Tip)[]> {
    const {
      transactions,
      cursor: nextCursor
    } = await this.transactionFactory.searchTransactions(
      'tip',
      undefined,
      { sort: 'HEIGHT_DESC', cursor, limit },
      address
    )

    return this.buildFeed(transactions, nextCursor)
  }

  private buildFeed(
    txs: ArdbTransaction[],
    cursor: string
  ): (FeedItem & Tip)[] {
    return txs.map(tx => {
      const item: FeedItem & Tip = {
        guid: uuidv4(),
        category: 'tip',
        txId: tx.id,
        cursor,
        amount: this.$arweave.ar.winstonToAr(tx.quantity.winston, {
          formatted: true,
          decimals: 4
        }),
        from: tx.owner.address
      }

      return item
    })
  }
}
