import { Context } from '@nuxt/types'
import Arweave from 'arweave'
import ArDB from '@textury/ardb'
import { readContract, interactWriteDryRun, interactWrite } from 'smartweave'
import { ContractInteractionResult } from 'smartweave/lib/contract-step'

import { TransactionService } from './'

// import {
//   handle,
//   UsernamesContractState
// } from '~/contracts'

export default class UsernameService extends TransactionService {
  private deployer!: string
  private contract?: string

  private async fetchContract(): Promise<string> {
    // const txs = await this.$ardb.search('transactions').find()

    // const contractTxs = await this.transactionFactory.searchTransactions(
    //   'contract',
    //   { owner: this.deployer, contractName: 'usernames' },
    //   'HEIGHT_DESC'
    // )

    // if (contractTxs.length > 0) {
    //   return contractTxs[0].id
    // }

    throw new Error('Error reading usernames contract')
  }

  async resolveUsername(address: string): Promise<string | undefined> {
    if (!this.contract) {
      try {
        this.contract = await this.fetchContract()
      } catch (error) {
        console.error(error)
        return
      }
    }

    // const state = await readContract(
    //   this.$arweave,
    //   this.contract
    // ) as UsernamesContractState

    // for (const username in state.usernames) {
    //   if (state.usernames[username].owner === address) {
    //     return username
    //   }
    // }

    return
  }

  async resolveAddress(username: string): Promise<string | undefined> {
    if (!this.contract) {
      try {
        this.contract = await this.fetchContract()
      } catch (error) {
        console.error(error)
        return
      }
    }

    // const state = await readContract(
    //   this.$arweave,
    //   this.contract
    // ) as UsernamesContractState

    // const entry = state.usernames[username]

    // if (entry?.owner) {
    //   return entry.owner
    // }

    return
  }

  async checkUsername(username: string): Promise<ContractInteractionResult> {
    if (!this.contract) {
      this.contract = await this.fetchContract()
    }

    // const state = await readContract(
    //   this.$arweave,
    //   this.contract
    // ) as UsernamesContractState

    // try {
    //   const res = handle(state, {
    //     caller: '',
    //     input: {
    //       function: 'register',
    //       username
    //     }
    //   })

    //   return { type: 'ok', state: res.state, result: res.result }
    // } catch (error) {
    //   return { type: 'exception', state, result: error.message }
    // }

    return { type: 'error', result: null, state: null }

    // NB: Ideally we'd just be able to use this, but doesn't work with ArLocal
    // return await interactWriteDryRun(
    //   this.$arweave,
    //   'use_wallet',
    //   this.contract,
    //   {
    //     function: 'register',
    //     username
    //   }
    // )
  }

  async registerUsername(username: string): Promise<ContractInteractionResult> {
    if (!this.contract) {
      this.contract = await this.fetchContract()
    }

    const txId = await interactWrite(
      this.$arweave,
      'use_wallet',
      this.contract,
      {
        function: 'register',
        username
      }
    )

    // TODO -> This should be getStatus() and check for num_of_confirmations!
    //         However, ArLocal has not implemented this endpoint
    const tx = await this.$arweave.transactions.get(txId)

    return { type: 'ok', result: '', state: {} }
  }
}