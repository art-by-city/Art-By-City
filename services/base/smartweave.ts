import { Contract, SmartWeave } from 'redstone-smartweave'
import { Context } from '@nuxt/types'

import { ArweaveService } from './'
import { ArweaveAppConfig } from '~/types'

export default class SmartWeaveService extends ArweaveService {
  $smartweave!: SmartWeave
  config!: ArweaveAppConfig

  constructor(context: Context) {
    super(context)

    this.$smartweave = context.$smartweave
    this.config = context.$config.arweave.appConfig
  }

  async writeInteraction<ContractInput, ContractState>(
    contract: Contract<ContractState>,
    input: ContractInput
  ) {
    return await contract
      .connect('use_wallet')
      .writeInteraction<ContractInput>(input, [
        { name: 'App-Name', value: this.config.name },
        { name: 'App-Version', value: this.config.version }
      ])
  }
}
