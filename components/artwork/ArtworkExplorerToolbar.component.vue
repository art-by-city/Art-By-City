<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="3">
        <v-select
          v-model="region"
          name="region"
          label="Region"
          :items="regions"
          outlined
          rounded
          dense
          single-line
          prepend-icon="mdi-map"
        ></v-select>
      </v-col>
      <v-col offset="1" cols="4" class="text-center">
        <v-btn icon @click="onRefreshClicked">
          <v-icon x-large color="black">mdi-record-circle</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="3">
        <v-select
          v-model="type"
          name="type"
          label="Type"
          :items="artworkTypes"
          outlined
          rounded
          dense
          single-line
          prepend-icon="mdi-image-frame"
        ></v-select>
      </v-col>
      <v-col offset="1" cols="4">
        <v-combobox
          v-model="hashtags"
          name="hashtags"
          label="Hashtags"
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
import { Vue, Component, Emit, PropSync } from 'nuxt-property-decorator'

import { artworkTypes, regions } from '~/server/core/artwork/validator'

@Component
export default class ArtworkExplorerToolbar extends Vue {
  // Selections
  artworkTypes = ['Any'].concat(artworkTypes)
  regions = ['Any'].concat(regions)

  // Options
  type: string = 'Any'
  region: string = 'Any'
  hashtags: string[] = []

  @Emit('refresh') onRefreshClicked() {
    return { type: this.type, region: this.region, hashtags: this.hashtags }
  }

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
    this.hashtags = hashtags.map((h) => {
      return h[0] === '#' ? h.slice(1) : h
    })
  }
}
</script>
