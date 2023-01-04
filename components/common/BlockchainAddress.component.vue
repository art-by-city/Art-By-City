<template>
  <v-tooltip top>
    <template v-slot:activator="{ attrs, on }">
      <span v-on="on" v-bind="attrs">{{ truncatedAddress }}</span>
    </template>
    <span>{{ address }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class BlockchainAddress extends Vue {
  @Prop({ type: Number, required: false, default: 8 }) leadingChars!: number
  @Prop({ type: Number, required: false, default: 6 }) trailingChars!: number

  @Prop({ type: String, required: true }) address!: string

  get truncatedAddress(): string {
    if (this.address.length < this.leadingChars + this.trailingChars + 3) {
      return this.address
    }

    return this.address.substring(0, this.leadingChars)
      + '...'
      + this.address.substring(this.address.length - this.trailingChars)
  }
}
</script>
