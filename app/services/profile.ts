import Transaction from 'arweave/node/lib/transaction'

import { Profile } from '~/app/core/profile'
import { TransactionService } from '~/app/services'

export default class ProfileService extends TransactionService {
  cache: { profiles: { [address: string]: Profile } } = { profiles: {} }

  async createProfileTransaction(profile: Profile): Promise<Transaction> {
    return await this.transactionFactory.buildEntityTransaction(
      'profile',
      JSON.stringify({ ...profile })
    )
  }

  async fetchProfile(
    address: string,
    force: boolean = false
  ): Promise<Profile | null> {
    if (force || !this.cache.profiles[address]) {
      const { transactions } = await this.transactionFactory.searchTransactions(
        'profile',
        address
      )

      if (transactions[0]) {
        const res = await this.$arweave.api.get(transactions[0].id)

        if (res.data) {
          this.cache.profiles[address] = res.data as Profile
        }
      }
    }

    return this.cache.profiles[address] || null
  }
}
