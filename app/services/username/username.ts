import { Context } from '@nuxt/types'
import { Contract } from 'warp-contracts'

import { SmartWeaveService } from '..'
import { UsernamesContractState, handle } from './contract'

export default class UsernameService extends SmartWeaveService {
  private contract!: Contract<UsernamesContractState>
  private txId!: string
  private isContractReady: boolean = false

  constructor(context: Context) {
    super(context)

    this.txId = this.config.contracts['usernames']

    if (process.client) {
      this.contract = this.$warp
        .contract<UsernamesContractState>(this.txId)
        .setEvaluationOptions({
          // NB: Boost perf since this contract does not read other contracts
          updateCacheForEachInteraction: false
        })

      this.contract.readState().then(() => this.isContractReady = true)
    }
  }

  private async getUsernames(): Promise<UsernamesContractState['usernames']> {
    if (process.client && this.isContractReady) {
      const {
        cachedValue: {
          state: { usernames }
        }
      } = await this.contract.readState()

      return usernames
    } else {
      return this.context.app.$accessor.usernames.usernames
    }
  }

  async resolveUsername(address: string): Promise<string | null> {
    try {
      const usernames = await this.getUsernames()

      return usernames[address] || null
    } catch (err) {
      console.error(err)
    }

    return null
  }

  async resolveAddress(username: string): Promise<string | null> {
    try {
      const usernames = await this.getUsernames()

      for (const address in usernames) {
        if (usernames[address] === username) {
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

  async validate(username: string, caller: string): Promise<string | null> {
    try {
      const { cachedValue: { state } } = await this.contract.readState()

      const clonedState: UsernamesContractState = { usernames: {} }

      for (const addr in state.usernames) {
        clonedState.usernames[addr] = state.usernames[addr]
      }

      try {
        handle(clonedState, {
          caller,
          input: {
            function: 'register',
            username
          }
        })
      } catch (err) {
        return err.message
      }


    } catch (err) {
      console.error(err)
      return 'error validating username'
    }

    return null
  }

  async registerUsername(username: string): Promise<string | null> {
    return (await this.writeInteraction(
      this.contract,
      {
        function: 'register',
        username
      }
    ))?.originalTxId || null
  }

  async releaseUsername(): Promise<string | null> {
    return (await this.writeInteraction(
      this.contract,
      {
        function: 'release'
      }
    ))?.originalTxId || null
  }
}
