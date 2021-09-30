import Arweave from 'arweave'
import { Context } from '@nuxt/types'

import { ArweaveAppConfig } from '~/types'

export default class ArweaveService {
  $arweave!: Arweave
  config!: ArweaveAppConfig

  constructor(context: Context) {
    this.$arweave = context.$arweave
    this.config = context.$config.arweave.appConfig
  }
}
