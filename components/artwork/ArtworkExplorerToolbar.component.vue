<template>
  <v-container fluid class="pa-0">
    <v-row dense>
      <v-col cols="3">
        <v-autocomplete
          v-model="opts.city"
          class="condensed-input text-lowercase"
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
        >
          <template v-slot:item="{ item }">
            <span class="text-lowercase">{{ item.name }}</span>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col offset="1" cols="4" class="text-center">
        <v-btn icon @click="onRefresh">
          <v-icon x-large color="black">mdi-record-circle</v-icon>
        </v-btn>
      </v-col>
      <v-col offset="3">
        <v-btn
          v-if="$store.state.artworks.slotB.length > 0"
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
        >
          <template v-slot:item="{ item }">
            <span class="text-lowercase">{{ item }}</span>
          </template>
        </v-select>
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
          :items="hashtags"
          no-filter
          hide-selected
          :search-input.sync="hashtagSearchInput"
          @input="onHashtagInput"
          @update:search-input="onHashtagUpdateSearchInput"
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
              class="text-lowercase"
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
            {{ gridIcon }}
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop, PropSync } from 'nuxt-property-decorator'
import Fuse from 'fuse.js'

import { artworkTypes } from '~/server/core/artwork/validator'

@Component
export default class ArtworkExplorerToolbar extends Vue {
  artworkTypes = ['Any'].concat(artworkTypes)
  cities = [{ id: 'Any', name: 'Any' }].concat(this.$store.state.config.cities)
  hashtags = this.$store.state.config.hashtags
  fuzzyHashtags = new Fuse(this.hashtags, { includeScore: true })
  hashtagSearchInput: string = ''
  gridSizes = [1,3]

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
      hashtags: this.opts.hashtags,
      limit: 3
    }
  }

  @Emit('previous') onPreviousClicked() {}

  @PropSync('gridsize', { type: Number }) syncedGridSize!: number

  onGridPreferenceClicked() {
    let nextIndex = this.gridSizes.indexOf(this.syncedGridSize) + 1
    if (nextIndex >= this.gridSizes.length) {
      this.syncedGridSize = this.gridSizes[0]
    } else {
      this.syncedGridSize = this.gridSizes[nextIndex]
    }
  }

  get gridIcon() {
    switch (this.syncedGridSize) {
      case 1:
        // return 'mdi-square-outline'
        return 'mdi-circle-small'
      case 3:
        // return 'mdi-view-week-outline'
        return 'mdi-dots-horizontal'
      case 6:
        return 'mdi-view-module-outline'
      case 9:
        return 'mdi-grid'
    }
  }

  onHashtagInput(hashtags: string[]) {
    this.opts.hashtags = hashtags.map((h) => {
      return h[0] === '#' ? h.slice(1) : h
    })
    this.hashtagSearchInput = ''
    this.onRefresh()
  }

  onHashtagUpdateSearchInput(value: string) {
    if (!value) {
      this.hashtags = this.$store.state.config.hashtags
    } else {
      const result = this.fuzzyHashtags.search(value)

      this.hashtags = result.map((r: any) => r.item)
    }
  }
}
</script>

<style scoped>
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
</style>
