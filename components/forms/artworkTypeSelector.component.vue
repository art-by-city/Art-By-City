<template>
  <div id="artworkTypeSelector" class="artwork-type-selector condensed-input">
    <v-select
      v-bind:value="value"
      v-on:input="$emit('input', $event)"
      class="text-lowercase"
      name="type"
      label="type"
      :items="artworkTypes"
      outlined
      single-line
      :disabled="disabled"
      attach="#artworkTypeSelector"
    >
      <template v-slot:item="{ item }">
        <span class="text-lowercase">{{ item }}</span>
      </template>
    </v-select>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model } from 'nuxt-property-decorator'

import { artworkTypes } from '~/models/artwork/artworkOptions'

@Component
export default class ArtworkTypeSelector extends Vue {
  @Prop({ type: Boolean }) readonly disabled!: boolean

  @Model('input', { type: String, required: true }) value!: string

  artworkTypes = artworkTypes
}
</script>
