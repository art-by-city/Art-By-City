import Arweave from 'arweave'
import { Context } from '@nuxt/types'

export default class ArweaveService {
  $arweave!: Arweave

  constructor(context: Context) {
    this.$arweave = context.$arweave
  }
}
