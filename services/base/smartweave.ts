import { SmartWeave } from 'redstone-smartweave'
import { Context } from '@nuxt/types'

import { ArweaveService } from '.'

export default class SmartWeaveService extends ArweaveService {
  $smartweave!: SmartWeave

  constructor(context: Context) {
    super(context)
    this.$smartweave = context.$smartweave
  }
}
