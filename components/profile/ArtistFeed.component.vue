<template>
  <v-row class="artist-feed">
    <v-col
      v-for="(post, i) in feed"
      :key="post.guid"
      cols="4"
    >
    <v-lazy transition="fade-transition">
      <ArtworkCard :artwork="post.artwork" />
    </v-lazy>
    </v-col>
   </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { FeedItem } from '~/types'
import ArtworkCard from '~/components/artwork/ArtworkCard.component.vue'

@Component({
  components: {
    ArtworkCard
  }
})
export default class ArtistFeed extends Vue {
  feed: FeedItem[] = []

  @Prop({
    type: String,
    required: true
  }) readonly address!: string

  async fetch() {
    this.feed = await this.$artworkService.fetchFeed(this.address)
  }
}
</script>
