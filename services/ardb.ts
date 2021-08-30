import ArDB from '@textury/ardb'
import { Context } from '@nuxt/types'

import { ArweaveService } from './'

export default class ArDBService extends ArweaveService {
  $ardb!: ArDB

  constructor(context: Context) {
    super(context)
    this.$ardb = context.$ardb
  }
}
