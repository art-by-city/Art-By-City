<template>
  <span class="currency-estimate">
    <span>{{ humanReadableTxTotal }} <b>AR</b></span>
    <span v-if="usdEstimate">≈</span>
    <span v-if="usdEstimate">{{ usdEstimate }}</span>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { convertARtoUSD } from '~/app/util'

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

  get usdEstimate(): string {
    if (this.winston && this.$priceService.priceUSD) {
      return convertARtoUSD(
        this.$arweave.ar.winstonToAr(this.winston),
        this.$priceService.priceUSD
      )
    }

    return ''
  }
}
</script>
