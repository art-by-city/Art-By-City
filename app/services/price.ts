import { Context } from '@nuxt/types'

import { ArweaveService } from './base'

export default class PriceService extends ArweaveService {
  constructor(context: Context) {
    super(context)

    this._getArPriceUSD()
  }

  _arPriceUSD: number | null = null
  get priceUSD(): number | null {
    if (!this._arPriceUSD) {
      this._getArPriceUSD()
    }

    return this._arPriceUSD
  }
  async _getArPriceUSD(): Promise<void> {
    const { arweave } = await this.context.$axios.$get(
      'https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=usd'
    )

    this._arPriceUSD = arweave?.usd || null
  }
}
