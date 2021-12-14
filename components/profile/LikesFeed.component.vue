<template>
  <div class="likes-feed">
    <v-row>
      <v-col
        v-for="(item, i) in feed"
        :key="item.guid"
        cols="4"
      >
        <v-lazy transition="fade-transition">
          <ArtworkCard :txId="item.txId" />
        </v-lazy>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import ArtworkCard from '~/components/artwork/ArtworkCard.component.vue'
import { FeedItem } from '~/types'

@Component({
  components: {
    ArtworkCard
  }
})
export default class LikesFeed extends Vue {
  feed: FeedItem[] = []

  @Prop({
    type: String,
    required: true
  }) readonly address!: string

  async fetch() {
    this.feed = await this.$artworkService.fetchLikedArtworkFeed(this.address)
  }
}
</script>
