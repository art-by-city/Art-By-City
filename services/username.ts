import { Context } from '@nuxt/types'
import { Contract, InteractionResult } from 'redstone-smartweave'

import {
  UsernamesContractInput,
  UsernamesContractResult,
  UsernamesContractState
} from 'contracts/src/usernames/contract'
import { SmartWeaveService } from './'

export default class UsernameService extends SmartWeaveService {
  private contract!: Contract<UsernamesContractState>
  private txId = 'fAIofxVwPZqj-lK2gN6Z-eVmmw3jjcuURzb1wEJmsBQ'

  constructor(context: Context) {
    super(context)

    this.contract = this.$smartweave
      .contract<UsernamesContractState>(this.txId)
      .setEvaluationOptions({
        // NB: Boost perf since this contract does not read other contracts
        updateCacheForEachInteraction: false
      })
  }

  async resolveUsername(address: string): Promise<string | null> {
    const { state } = await this.contract.readState()

    return state.usernames[address] || null
  }

  async resolveAddress(username: string): Promise<string | null> {
    const { state } = await this.contract.readState()

    for (const address in state.usernames) {
      if (state.usernames[address] === username) {
        return address
      }
    }

    this.contract.evaluationOptions()

    return null
  }

  async checkUsername(username: string):
    Promise<InteractionResult<UsernamesContractState, UsernamesContractResult>>
  {
     return await this.contract.dryWrite<UsernamesContractInput>({
      function: 'register',
      username
    })
  }

  async registerUsername(username: string): Promise<string | null> {
    return await this.writeInteraction(
      this.contract,
      {
        function: 'register',
        username
      }
    )
  }
}
