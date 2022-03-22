import ArdbTransaction from 'ardb/lib/models/transaction'
import Transaction from 'arweave/node/lib/transaction'

import { FeedItem, Tip } from '~/types'
import { uuidv4 } from '../helpers'
import { TransactionService } from './'

export default class TipsService extends TransactionService {
  cache: {
    tips: {
      [address: string]: {
        [cursor: string]: (FeedItem & Tip)[]
      }
    }
  } = {
    tips: {}
  }

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
    force: boolean = false,
    limit: number = 100
  ): Promise<(FeedItem & Tip)[]> {
    if (
      force
      || !this.cache.tips[address]
      || !this.cache.tips[address][cursor || '']
    ) {
      const {
        transactions,
        cursor: nextCursor
      } = await this.transactionFactory.searchTransactions(
        'tip',
        undefined,
        { sort: 'HEIGHT_DESC', cursor, limit },
        address
      )

      if (!this.cache.tips[address]) {
        this.cache.tips[address] = {}
      }
      this.cache.tips[address][cursor || ''] = this.buildFeed(
        transactions,
        nextCursor
      )
    }

    return this.cache.tips[address][cursor || ''] || []
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
