<template>
  <v-container fluid class="pa-0">
    <v-row dense>
      <v-col cols="3" class="pa-0">
        <CitySelector
          v-model="opts.city"
          :cities="cities"
          @input="onRefresh"
        />
      </v-col>
      <v-col offset="1" cols="4" class="text-center pa-0">
        <v-btn icon @click="onRefresh" class="shift-icon-button-up-a-bit">
          <v-icon x-large color="black">mdi-refresh</v-icon>
        </v-btn>
      </v-col>
      <v-col offset="3" class="pa-0">
        <v-btn
          v-if="$store.state.artworks.prev.length > 0"
          icon
          class="shift-icon-button-up-a-bit"
          @click="onPreviousClicked"
        >
          <v-icon x-large color="black">
            {{
              this.$store.state.artworks.isPrevBeingViewed
                ? 'mdi-arrow-right-circle'
                : 'mdi-arrow-left-circle'
            }}
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="3" class="pa-0">
        <ArtworkTypeSelector
          v-model="opts.type"
          @input="onRefresh"
        />
      </v-col>
      <v-col offset="1" cols="4" class="pa-0">
        <HashtagSelector
          v-model="opts.hashtags"
          :hashtags="hashtags"
          :maxSelectable="3"
          @input="onRefresh"
        />
      </v-col>
      <v-col offset="3" cols="1" class="pa-0">
        <v-btn
          class="d-none d-sm-none d-md-flex shift-icon-button-up-a-bit"
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
  artworkTypes = ['All'].concat(artworkTypes)
  cities = [{ id: 'All', name: 'All' }].concat(this.$store.state.config.cities)
  hashtags = this.$store.state.config.hashtags
  fuzzyHashtags = new Fuse(this.hashtags, { includeScore: true })
  hashtagSearchInput: string = ''
  gridSizes = [1,3]

  @Prop({
    default: {
      type: 'All',
      city: 'All',
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

<style scoped>
.shift-icon-button-up-a-bit {
  top: -6px;
}
</style>
