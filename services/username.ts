import { Context } from '@nuxt/types'
import { Contract, InteractionResult } from 'redstone-smartweave'

import { SmartWeaveService } from './'

export interface UsernamesContractState {
  usernames: {
    [owner: string]: string
  }
}

export type UsernamesContractInput = {
  function: 'register'
  username: string
} | {
  function: 'release'
}
export type UsernamesContractResult = any

export default class UsernameService extends SmartWeaveService {
  private contract!: Contract<UsernamesContractState>
  private txId!: string

  constructor(context: Context) {
    super(context)

    this.txId = this.config.contracts['usernames']

    this.contract = this.$smartweave
      .contract<UsernamesContractState>(this.txId)
      .setEvaluationOptions({
        // NB: Boost perf since this contract does not read other contracts
        updateCacheForEachInteraction: false
      })
  }

  async resolveUsername(address: string): Promise<string | null> {
    try {
      const { state } = await this.contract.readState()

      return state.usernames[address] || null
    } catch (err) {
      console.error(err)
    }

    return null
  }

  async resolveAddress(username: string): Promise<string | null> {
    try {
      const { state } = await this.contract.readState()

      for (const address in state.usernames) {
        if (state.usernames[address] === username) {
          return address
        }
      }
    } catch (err) {
      console.error(err)
    }

    return null
  }

  async resolve(usernameOrAddress: string): Promise<{
    username: string | null,
    address: string | null
  }> {
    let username = null, address = null
    const resolvedUsername = await this.resolveUsername(usernameOrAddress)
    const resolvedAddress = await this.resolveAddress(usernameOrAddress)

    if (!resolvedUsername && !resolvedAddress) {
      if (usernameOrAddress.length === 43) {
        address = usernameOrAddress
      }
    } else if (!resolvedUsername && resolvedAddress) {
      username = usernameOrAddress
      address = resolvedAddress
    } else if (resolvedUsername && !resolvedAddress) {
      address = usernameOrAddress
      username = resolvedUsername
    }

    return { username, address }
  }

  async checkUsername(username: string, caller: string):
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

  async releaseUsername(): Promise<string | null> {
    return await this.writeInteraction(
      this.contract,
      {
        function: 'release'
      }
    )
  }
}
