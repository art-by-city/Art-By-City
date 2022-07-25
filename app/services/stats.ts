import { Context } from '@nuxt/types'

import { ArweaveConfig } from '~/app/infra/arweave'
import { StatsSummary } from '../core'

export default class StatsService {
  private context: Context
  private config!: ArweaveConfig

  constructor(context: Context) {
    this.context = context
    this.config = context.$config.arweave
  }

  async fetchSummary(): Promise<StatsSummary> {
    const summary = await this.context.$axios.$get(
      `${this.config.gateway}/stats/summary`
    )

    return {
      users: Number.parseInt(summary.users),
      dappUsers: Number.parseInt(summary.dappUsers),
      artists: Number.parseInt(summary.artists),
      publications: Number.parseInt(summary.publications),
      transactions: Number.parseInt(summary.transactions),
      dappTransactions: Number.parseInt(summary.dappTransactions),
      likesCount: Number.parseInt(summary.likesCount),
      likesTotal: summary.likesTotal,
      tipsCount: Number.parseInt(summary.tipsCount),
      tipsTotal: summary.tipsTotal,
      networkFees: summary.networkFees
    }
  }
}
