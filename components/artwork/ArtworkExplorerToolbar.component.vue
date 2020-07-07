<template>
  <v-container fluid class="pa-0">
    <v-row dense>
      <v-col cols="3">
        <v-autocomplete
          v-model="opts.city"
          class="condensed-input"
          name="city"
          label="city"
          :items="cities"
          outlined
          rounded
          dense
          single-line
          prepend-icon="mdi-map"
          item-text="name"
          item-value="id"
          item-disabled="disabled"
          @input="onRefresh"
        ></v-autocomplete>
      </v-col>
      <v-col offset="1" cols="4" class="text-center">
        <v-btn icon @click="onRefresh">
          <v-icon x-large color="black">mdi-record-circle</v-icon>
        </v-btn>
      </v-col>
      <v-col offset="3">
        <v-btn
          v-if="$store.state.artworks.prev.length > 0"
          icon
          @click="onPreviousClicked"
        >
          <v-icon x-large color="black">mdi-arrow-left-circle</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="3">
        <v-select
          v-model="opts.type"
          class="condensed-input"
          name="type"
          label="type"
          :items="artworkTypes"
          outlined
          rounded
          dense
          single-line
          prepend-icon="mdi-image-frame"
          @input="onRefresh"
        ></v-select>
      </v-col>
      <v-col offset="1" cols="4">
        <v-combobox
          v-model="opts.hashtags"
          class="condensed-input"
          name="hashtags"
          label="hashtags"
          multiple
          chips
          outlined
          rounded
          dense
          single-line
          @input="onHashtagInput"
        >
          <template v-slot:selection="data">
            <v-chip
              :key="JSON.stringify(data.item)"
              v-bind="data.attrs"
              :input-value="data.selected"
              :disabled="data.disabled"
              close
              pill
              small
              @click:close="data.parent.selectItem(data.item)"
            >
              # {{ data.item }}
            </v-chip>
          </template>
        </v-combobox>
      </v-col>
      <v-col offset="3" cols="1">
        <v-btn
          class="d-none d-sm-none d-md-flex"
          icon
          @click="onGridPreferenceClicked"
        >
          <v-icon x-large color="black">
            {{
              syncedGridSize === 9
                ? 'mdi-grid'
                : syncedGridSize === 6
                ? 'mdi-view-module-outline'
                : 'mdi-view-week-outline'
            }}
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop, PropSync } from 'nuxt-property-decorator'

import { artworkTypes } from '~/server/core/artwork/validator'

@Component
export default class ArtworkExplorerToolbar extends Vue {
  artworkTypes = ['Any'].concat(artworkTypes)
  cities = [{ id: 'Any', name: 'Any' }].concat(this.$store.state.config.cities)

  @Prop({
    default: {
      type: 'Any',
      city: 'Any',
      hashtags: [] as string[]
    }
  })
  opts: any

  @Emit('refresh') onRefresh() {
    return {
      type: this.opts.type,
      city: this.opts.city,
      hashtags: this.opts.hashtags
    }
  }

  @Emit('previous') onPreviousClicked() {}

  @PropSync('gridsize', { type: Number }) syncedGridSize!: number

  onGridPreferenceClicked() {
    switch (this.syncedGridSize) {
      case 3:
        this.syncedGridSize = 6
        break
      case 6:
        this.syncedGridSize = 9
        break
      case 9:
      default:
        this.syncedGridSize = 3
    }
  }

  onHashtagInput(hashtags: string[]) {
    this.opts.hashtags = hashtags.map((h) => {
      return h[0] === '#' ? h.slice(1) : h
    })
    // this.$emit('refresh', this.opts)
    this.onRefresh()
  }
}
</script>

<style scoped>
.condensed-input >>> .v-label {
  font-size: 14px;
  top: 6px;
}
.condensed-input >>> .v-select__selection {
  font-size: 14px;
}
.condensed-input >>> input {
  font-size: 14px;
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
</style>
