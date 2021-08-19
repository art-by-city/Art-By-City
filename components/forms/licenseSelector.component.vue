<template>
  <div class="license-selector">
    <v-autocomplete
      v-bind:value="value"
      @input="$emit('input', $event)"
      :items="licenses"
      name="license"
      label="License"
    >
      <template v-slot:append-outer>
        <a
          v-if="value"
          :href="value.reference"
          target="_blank"
          class="license-anchor"
        >
          Learn More
          <v-icon small dense class="adjust-icon">
            mdi-open-in-new
          </v-icon>
        </a>
      </template>
    </v-autocomplete>

  </div>
</template>

<script lang="ts">
import { Component, Model, Vue } from 'nuxt-property-decorator'

import { License } from '~/types'
import spdx from '~/helpers/licenses.json'

@Component
export default class LicenseSelector extends Vue {
  @Model('input', { type: Object }) value?: License

  _licenses!: typeof spdx.licenses

  get licenses() {
    if (!this._licenses) {
      this._licenses = spdx.licenses.sort((a, b) => {
        return ('' + a.name).localeCompare(b.name)
      })
    }

    return this._licenses.map(license => {
      return { text: license.name, value: license }
    })
  }
}
</script>

<style scoped>
.adjust-icon {
  margin-top: -3px;
}

.license-anchor {
  white-space: nowrap;
}
</style>
