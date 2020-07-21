<template>
  <div id="citySelector" class="city-selector condensed-input">
    <v-autocomplete
      v-bind:value="value"
      v-on:input="$emit('input', $event)"
      class="condensed-input text-lowercase"
      name="city"
      label="city"
      :items="cities"
      outlined
      single-line
      item-text="name"
      item-value="id"
      item-disabled="disabled"
      attach="#citySelector"
      :disabled="disabled"
    >
      <template v-slot:item="{ item }">
        <span class="text-lowercase">{{ item.name }}</span>
      </template>
      <template v-slot:selection="{ item }">
        <span class="text-lowercase">{{ item.name }}</span>
      </template>
    </v-autocomplete>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model } from 'nuxt-property-decorator'

interface City {
  id: string
  code: string
  name: string
  country: string
}

@Component
export default class CitySelector extends Vue {
  @Prop({ type: Array }) readonly cities!: City[]

  @Prop({ type: Boolean }) readonly disabled!: boolean

  @Model('input', { type: String, required: true }) value!: string
}
</script>

<style scoped>
.city-selector >>> .v-menu__content {
  top: auto !important;
  left: auto !important;
}

.condensed-input >>> .v-label {
  font-size: 14px;
  text-transform: lowercase;
  top: 6px;
}
.condensed-input >>> .v-select__selection {
  font-size: 14px;
  text-transform: lowercase;
}
.condensed-input >>> input {
  font-size: 14px;
  text-transform: lowercase;
}
.condensed-input >>> .v-input__slot {
  min-height: 32px !important;
  height: 32px !important;
}
.condensed-input >>> .v-input__append-inner {
  margin-top: 3px !important;
}
.condensed-input >>> .v-text-field__details {
  display: none;
}
.condensed-input >>> .v-list-item {
  font-size: 14px;
  height: 24px;
  min-height: 24px;
}
</style>
