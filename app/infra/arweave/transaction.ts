import Arweave from 'arweave'
import Transaction from 'arweave/web/lib/transaction'
import { CreateTransactionInterface } from 'arweave/web/common'
import ArDB from 'ardb'
import ArdbTransaction from 'ardb/lib/models/transaction'

import { DomainEntityCategory } from '~/app/core/common'
import { ArweaveAppConfig } from '.'

export interface TransactionSearchOptions {
  type?: 'application/json',
  sort?: 'HEIGHT_ASC' | 'HEIGHT_DESC',
  tags?: { tag: string, value: string }[]
  limit?: number | 'all'
  cursor?: string
  min?: number
  max?: number
  to?: string | string[]
}

export interface TransactionSearchResults {
  cursor: string
  transactions: ArdbTransaction[]
}

export default class TransactionFactory {
  private arweave!: Arweave
  private config!: ArweaveAppConfig
  ardb!: ArDB

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

    tx.addTag('Protocol', 'ArtByCity')
    tx.addTag('App-Name', this.config.name)
    tx.addTag('App-Version', this.config.version)
    const hasContentTypeTag = tags.some(tag => tag.tag === 'Content-Type')
    const isBundle = tags.some(tag => tag.tag.startsWith('Bundle'))
    if (data && !hasContentTypeTag && !isBundle) {
      tx.addTag('Content-Type', 'application/json')
    }
    tx.addTag('Category', category)

    for (const tag of tags) {
      tx.addTag(tag.tag, tag.value)
    }

    return tx
  }

  async searchTransactions(
    category: DomainEntityCategory | DomainEntityCategory[],
    owner?: string | string[],
    opts: TransactionSearchOptions = {
      type: 'application/json',
      sort: 'HEIGHT_DESC',
      tags: []
    },
    recipient?: string | string[]
  ): Promise<TransactionSearchResults> {
    let query = this.ardb
      .search('transactions')
      .appName(this.config.name)
      .tag('Category', category)

    if (owner) {
      query = query.from(owner)
    }

    if (recipient) {
      query = query.to(recipient)
    }

    if (opts.type) {
      query = query.type(opts.type)
    }

    if (opts.tags) {
      for (const tag of opts.tags) {
        query = query.tag(tag.tag, tag.value)
      }
    }

    if (opts.min) {
      query = query.min(opts.min)
    }

    if (opts.max) {
      query = query.max(opts.max)
    }

    if (opts.to) {
      query = query.to(opts.to)
    }

    if (opts.cursor) {
      query = query.cursor(opts.cursor)
    }

    if (opts.limit && opts.limit !== 'all') {
      query = query.limit(opts.limit)
    }

    const sort = opts?.sort || 'HEIGHT_DESC'

    const transactions = opts.limit === 'all'
      ? await query.findAll({ sort }) as ArdbTransaction[]
      : await query.find({ sort }) as ArdbTransaction[]
    const cursor = query.getCursor()

    return { cursor, transactions }
  }
}
