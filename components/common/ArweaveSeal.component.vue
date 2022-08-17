<template>
  <img class="arweave-seal mx-4 mt-4 pb-4" :src="src" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class ArweaveSeal extends Vue {
  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly dense: boolean | undefined

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly dark: boolean | undefined

  get isDenseOrMobile(): boolean {
    return this.dense
      || ['xs', 'sm', 'md'].includes(this.$vuetify.breakpoint.name)
  }

  get src(): string {
    const base = '/logo/arweave'
    if (this.isDenseOrMobile && this.dark) {
      return `${base}/arweave-seal-dark-small.svg`
    } else if (!this.isDenseOrMobile && this.dark) {
      return `${base}/arweave-seal-dark.svg`
    } else if (this.isDenseOrMobile && !this.dark) {
      return `${base}/arweave-seal-light-small.svg`
    } else {
      return `${base}/arweave-seal-light.svg`
    }
  }
}
</script>

<style scoped>
.arweave-seal {
  /* position: absolute; */
  /* z-index: 9999; */
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.025);
}
</style>
