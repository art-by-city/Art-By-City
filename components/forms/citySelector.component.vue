<template>
  <div id="citySelector" class="city-selector condensed-input">
    <v-autocomplete
      v-bind:value="value"
      v-on:input="$emit('input', $event)"
      class="text-lowercase"
      name="NOAUTOCOMPLETE-city-NOAUTOCOMPLETE"
      label="city"
      :items="cities"
      outlined
      single-line
      item-text="name"
      item-value="id"
      item-disabled="disabled"
      attach="#citySelector"
      :disabled="disabled"
      :rules="rules"
      autocomplete="new-password"
      aria-autocomplete="new-password"
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
  @Model('input', { type: String, required: true }) value!: string
  @Prop({ type: Boolean }) readonly disabled!: boolean
  @Prop({ type: Boolean }) readonly required!: boolean
  @Prop({ type: Array }) readonly cities!: City[]

  private isValidCity(cityId: string): boolean {
    for (let i = 0; i < this.cities.length; i++) {
      if (this.cities[i].id === cityId) {
        return true
      }
    }

    return false
  }

  get rules() {
    return [(cityId: string = '') => {
      if (this.required && !this.isValidCity(cityId)) {
        return `city is required`
      }

      return true
    }]
  }
}
</script>
