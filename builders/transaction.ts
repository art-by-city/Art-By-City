import Arweave from 'arweave'
import Transaction from 'arweave/node/lib/transaction'

type DomainEntityCategory = 'artwork'
interface ArweaveAppConfig {
  name: string
  version: string
}

export default class TransactionBuilder {
  private arweave!: Arweave
  private config!: ArweaveAppConfig

  constructor(arweave: Arweave, config: ArweaveAppConfig) {
    this.arweave = arweave
    this.config = config
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
}
