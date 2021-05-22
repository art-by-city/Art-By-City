<template>
  <v-container fluid class="artwork-explorer-toolbar-container pb-5 pt-5">
    <v-row justify="center" style="margin-left: 0px;">
      <v-col cols="3" sm="3" class="pa-0">
        <CitySelector
          v-model="opts.city"
          :cities="cities"
          :dense="dense"
          @input="onRefresh"
        />
      </v-col>
      <v-col cols="9" sm="4" offset-sm="1" class="pa-0 pl-5 pr-5 pl-sm-0">
        <HashtagSelector
          v-model="opts.hashtags"
          :hashtags="hashtags"
          :maxSelectable="3"
          @input="onRefresh"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop } from 'nuxt-property-decorator'
import Fuse from 'fuse.js'

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
  cities = [{ id: 'All', name: 'All' }].concat(this.$store.state.config.cities)
  hashtags = this.$store.state.config.hashtags
  fuzzyHashtags = new Fuse(this.hashtags, { includeScore: true })
  hashtagSearchInput: string = ''

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly dense: boolean | undefined

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
      hashtags: this.opts.hashtags
    }
  }

  @Emit('previous') onPreviousClicked() {}
}
</script>
