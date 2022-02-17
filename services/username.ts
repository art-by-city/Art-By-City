import { Context } from '@nuxt/types'
import { Contract, InteractionResult } from 'redstone-smartweave'

import {
  UsernamesContractInput,
  UsernamesContractResult,
  UsernamesContractState
} from 'contracts/src/usernames/contract'
import { SmartWeaveService } from './'

// import {
//   handle,
//   UsernamesContractState
// } from '~/contracts'

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

  async resolveUsername(address: string): Promise<string | undefined> {
    const { state } = await this.contract.readState()

    return state.usernames[address]
  }

  async resolveAddress(username: string): Promise<string | undefined> {
    const { state } = await this.contract.readState()

    for (const address in state.usernames) {
      if (state.usernames[address] === username) {
        return address
      }
    }

    return
  }

  async checkUsername(username: string):
    Promise<InteractionResult<
      UsernamesContractState,
      UsernamesContractResult
    >> {
    return await this.contract.dryWrite<UsernamesContractInput>({
      function: 'register',
      username
    })
  }

  // async registerUsername(username: string): Promise<ContractInteractionResult> {
  //   if (!this.contract) {
  //     this.contract = await this.fetchContract()
  //   }

  //   const txId = await interactWrite(
  //     this.$arweave,
  //     'use_wallet',
  //     this.contract,
  //     {
  //       function: 'register',
  //       username
  //     }
  //   )

  //   // TODO -> This should be getStatus() and check for num_of_confirmations!
  //   //         However, ArLocal has not implemented this endpoint
  //   const tx = await this.$arweave.transactions.get(txId)

  //   return { type: 'ok', result: '', state: {} }
  // }
}
