<template>
  <div id="artworkTypeSelector" class="artwork-type-selector condensed-input">
    <v-select
      v-bind:value="value"
      @input="$emit('input', $event)"
      class="text-lowercase"
      name="type"
      label="type"
      :items="types"
      outlined
      single-line
      :disabled="disabled"
      :rules="rules"
      attach="#artworkTypeSelector"
      validate-on-blur
    ></v-select>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model } from 'nuxt-property-decorator'

import { ArtworkType } from '~/types'

@Component
export default class ArtworkTypeSelector extends Vue {
  @Model('input', { type: String, required: true }) value!: string
  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly disabled: boolean | undefined
  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly required: boolean | undefined
  @Prop({ type: Array }) readonly artworkTypes!: ArtworkType[]

  get types() {
    return this.artworkTypes.map((type) => {
      return {
        text: type.name,
        value: type.name,
        disabled: !type.enabled
      }
    })
  }

  get artworkTypeNames() {
    return this.artworkTypes.map((type) => { return type.name })
  }

  get rules() {
    return [(value: string = '') => {
      if (
        (this.required && !value) ||
        (value && this.artworkTypes && !this.artworkTypeNames.includes(value))
      ) {
        return `type is required`
      }

      return true
    }]
  }
}
</script>
