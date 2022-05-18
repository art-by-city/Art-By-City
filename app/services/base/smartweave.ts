import { Contract, SmartWeave } from 'redstone-smartweave'
import { Context } from '@nuxt/types'

import { ArweaveService } from '.'

export default class SmartWeaveService extends ArweaveService {
  $smartweave!: SmartWeave

  constructor(context: Context) {
    super(context)

    this.$smartweave = context.$smartweave
  }

  async writeInteraction<ContractInput, ContractState>(
    contract: Contract<ContractState>,
    input: ContractInput
  ) {
    try {
      return await contract
        .connect('use_wallet')
        .writeInteraction<ContractInput>(input, [
          { name: 'App-Name', value: this.config.app.name },
          { name: 'App-Version', value: this.config.app.version }
        ], undefined, true)
    } catch (err) {
      console.error(err)

      return null
    }
  }
}
