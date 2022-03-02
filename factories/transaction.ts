import Arweave from 'arweave'
import Transaction from 'arweave/web/lib/transaction'
import { CreateTransactionInterface } from 'arweave/web/common'
import ArDB from '@textury/ardb'
import ArdbTransaction from '@textury/ardb/lib/models/transaction'

import { ArweaveAppConfig, DomainEntityCategory } from '../types'

export interface TransactionSearchOptions {
  type?: 'application/json',
  sort?: 'HEIGHT_ASC' | 'HEIGHT_DESC',
  tags?: { tag: string, value: string }[]
  limit?: number
  cursor?: string
}

export interface TransactionSearchResults {
  cursor: string
  transactions: ArdbTransaction[]
}

export default class TransactionFactory {
  private arweave!: Arweave
  private config!: ArweaveAppConfig
  private ardb!: ArDB

  constructor(arweave: Arweave, ardb: ArDB, config: ArweaveAppConfig) {
    this.arweave = arweave
    this.config = config
    this.ardb = ardb
  }

  async buildEntityTransaction(
    category: DomainEntityCategory,
    data?: string | Uint8Array | ArrayBuffer,
    tags: { tag: string, value: string }[] = [],
    target?: string,
    quantity?: string
  ): Promise<Transaction> {
    const opts: Partial<CreateTransactionInterface> = {}

    if (data) {
      opts.data = data
    }

    if (target && quantity) {
      opts.target = target
      opts.quantity = this.arweave.ar.arToWinston(quantity)
    }

    const tx = await this.arweave.createTransaction(opts)

    tx.addTag('App-Name', this.config.name)
    tx.addTag('App-Version', this.config.version)
    const hasContentTypeTag = tags.some(tag => tag.tag === 'Content-Type')
    if (data && !hasContentTypeTag) {
      tx.addTag('Content-Type', 'application/json')
    }
    tx.addTag('Category', category)

    for (const tag of tags) {
      tx.addTag(tag.tag, tag.value)
    }

    // tx.reward = Math.floor(Number.parseInt(tx.reward) * 1.1).toString()

    return tx
  }

  async searchTransactions(
    category: DomainEntityCategory,
    owner?: string | string[],
    opts: TransactionSearchOptions = {
      type: 'application/json',
      sort: 'HEIGHT_DESC',
      tags: []
    }
  ): Promise<TransactionSearchResults> {
    let query = this.ardb
      .search('transactions')
      .appName(this.config.name)
      .tag('Category', category)

    if (owner) {
      query = query.from(owner)
    }

    if (opts.type) {
      query = query.type(opts.type)
    }

    if (opts.tags) {
      for (const tag of opts.tags) {
        query = query.tag(tag.tag, tag.value)
      }
    }

    if (opts.cursor) {
      query = query.cursor(opts.cursor)
    }

    if (opts.limit) {
      query = query.limit(opts.limit)
    }

    const sort = opts?.sort || 'HEIGHT_DESC'

    const transactions = await query.find({ sort }) as ArdbTransaction[]
    const cursor = query.getCursor()

    return { cursor, transactions }
  }
}
