<template>
  <span class="currency-estimate">
    <span>{{ humanReadableTxTotal }} <b>AR</b></span>
    <span v-if="usdEstimate">≈</span>
    <span v-if="usdEstimate">{{ usdEstimate }}</span>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class CurrencyEstimate extends Vue {
  @Prop({
    type: String,
    required: false
  }) readonly winston?: string

  get humanReadableTxTotal() {
    if (this.winston) {
      return this.$arweave.ar.winstonToAr(this.winston, {
        decimals: 4
      })
    }

    return ''
  }

  get usdEstimate() {
    if (this.winston && this.$priceService.priceUSD) {
      let usd = Number.parseFloat(this.$arweave.ar.winstonToAr(this.winston))
                  * this.$priceService.priceUSD

      if (usd < 0.01) {
        return '< $0.01'
      }

      return usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    }

    return ''
  }
}
</script>
