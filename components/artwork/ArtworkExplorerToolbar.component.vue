<template>
  <v-container fluid class="pa-0">
    <v-row dense>
      <v-col cols="3">
        <CitySelector
          v-model="opts.city"
          :cities="cities"
          @input="onRefresh"
        />
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
        <ArtworkTypeSelector
          v-model="opts.type"
          @input="onRefresh"
        />
      </v-col>
      <v-col offset="1" cols="4">
        <HashtagSelector
          v-model="opts.hashtags"
          :hashtags="hashtags"
          :maxSelectable="3"
          @input="onRefresh"
        />
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

import { artworkTypes } from '~/models/artwork/artworkOptions'
import CitySelector from '~/components/forms/citySelector.component.vue'
import ArtworkTypeSelector from '~/components/forms/artworkTypeSelector.component.vue'
import HashtagSelector from '~/components/forms/hashtagSelector.component.vue'

@Component({
  components: {
    CitySelector,
    ArtworkTypeSelector,
    HashtagSelector
  }
})
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
}
</script>
