import { Context } from '@nuxt/types'
import Arweave from 'arweave'
import ArDB from '@textury/ardb'

export default class ProfileService {
  $arweave!: Arweave
  $ardb!: ArDB

  constructor(context: Context) {
    this.$arweave = context.$arweave
    this.$ardb = context.$ardb
  }

  // async fetchProfile(owner: string): Promise<ArtistProfile[]> {

  // }
}
