import Arweave from 'arweave'
import Transaction from 'arweave/node/lib/transaction'
import ArDB from '@textury/ardb'
import ArdbBlock from '@textury/ardb/lib/models/block'
import ArdbTransaction from '@textury/ardb/lib/models/transaction'

import { ArweaveAppConfig, DomainEntityCategory } from '../types'

export interface TransactionSearchOptions {
  sort?: 'HEIGHT_ASC' | 'HEIGHT_DESC'
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
    data: string | Uint8Array | ArrayBuffer | undefined,
    tags: { name: string, value: string }[] = []
  ): Promise<Transaction> {
    const tx = await this.arweave.createTransaction({ data })

    tx.addTag('App-Name', this.config.name)
    tx.addTag('App-Version', this.config.version)
    tx.addTag('Content-Type', 'application/json')
    tx.addTag('Category', category)

    for (const tag of tags) {
      tx.addTag(tag.name, tag.value)
    }

    return tx
  }

  async searchTransactions(
    category: DomainEntityCategory,
    owner?: string | string[],
    opts?: TransactionSearchOptions
  ): Promise<ArdbTransaction[] | ArdbBlock[]> {
    let query = this.ardb
      .search('transactions')
      .appName(this.config.name)
      .type('application/json')
      .tag('Category', category)

    if (owner) {
      query = query.from(owner)
    }

    const sort = opts?.sort || 'HEIGHT_DESC'

    return await query.find({ sort })
  }
}
