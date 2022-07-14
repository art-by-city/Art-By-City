import { Contract, Warp } from 'warp-contracts'
import { Context } from '@nuxt/types'

import { ArweaveService } from '.'

export default class SmartWeaveService extends ArweaveService {
  $warp!: Warp

  constructor(context: Context) {
    super(context)

    this.$warp = context.$warp
  }

  async writeInteraction<ContractInput, ContractState>(
    contract: Contract<ContractState>,
    input: ContractInput
  ) {
    return await contract
      .connect('use_wallet')
      .writeInteraction<ContractInput>(input, [
        { name: 'Protocol', value: 'ArtByCity' },
        { name: 'App-Name', value: this.config.app.name },
        { name: 'App-Version', value: this.config.app.version }
      ], undefined, true)
  }
}
