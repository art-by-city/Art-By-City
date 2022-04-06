import Arweave from 'arweave'
import Transaction from 'arweave/node/lib/transaction'

import { ArtworkCreationOptions } from '..'
import ArtworkBundleFactory from './bundle'

export default class ArtworkTransactionFactory {
  $arweave!: Arweave
  appName!: string
  appVersion!: string
  artworkBundleFactory!: ArtworkBundleFactory

  constructor($arweave: Arweave, appName: string, appVersion: string) {
    this.$arweave = $arweave
    this.appName = appName
    this.appVersion = appVersion
    this.artworkBundleFactory = new ArtworkBundleFactory(appName, appVersion)
  }

  async create(
    opts: ArtworkCreationOptions,
    logCb?: Function
  ): Promise<Transaction> {
    const {
      bundle,
      manifestId
    } = await this.artworkBundleFactory.create(opts, logCb)
    const data = bundle.getRaw()
    const tx = await this.$arweave.createTransaction({ data })
    tx.addTag('App-Name', this.appName)
    tx.addTag('App-Version', this.appVersion)
    tx.addTag('Bundle-Format', 'binary')
    tx.addTag('Bundle-Version', '2.0.0')
    tx.addTag('Category', 'artwork:bundle')
    tx.addTag('slug', opts.slug)
    tx.addTag('Manifest-ID', manifestId)

    return tx
  }
}
