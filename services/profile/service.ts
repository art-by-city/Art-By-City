import Transaction from 'arweave/node/lib/transaction'

import { Profile } from '~/types'
import { TransactionService } from '~/services'

export default class ProfileService extends TransactionService {
  async createProfileTransaction(profile: Profile): Promise<Transaction> {
    return await this.transactionFactory.buildEntityTransaction(
      'profile',
      JSON.stringify({ ...profile })
    )
  }

  async fetchProfile(owner: string): Promise<Profile | null> {
    const result = await this.transactionFactory.searchTransactions(
      'profile',
      owner
    )

    if (result.transactions[0]) {
      const res = await this.$arweave.api.get(result.transactions[0].id)

      return res.data as Profile
    }

    return null
  }
}
