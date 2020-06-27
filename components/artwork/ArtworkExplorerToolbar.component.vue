<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="3">
        <v-select
          v-model="opts.region"
          name="region"
          label="Region"
          :items="regions"
          outlined
          rounded
          dense
          single-line
          prepend-icon="mdi-map"
          @input="onRefresh"
        ></v-select>
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
    <v-row no-gutters>
      <v-col cols="3">
        <v-select
          v-model="opts.type"
          name="type"
          label="Type"
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
              close
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

import { artworkTypes, regions } from '~/server/core/artwork/validator'

@Component
export default class ArtworkExplorerToolbar extends Vue {
  artworkTypes = ['Any'].concat(artworkTypes)
  regions = ['Any'].concat(regions)
  @Prop({
    default: {
      type: 'Any',
      region: 'Any',
      hashtags: [] as string[]
    }
  })
  opts: any

  @Emit('refresh') onRefresh() {
    return {
      type: this.opts.type,
      region: this.opts.region,
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
