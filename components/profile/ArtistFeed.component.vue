<template>
  <v-container class="artist-feed">
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

    <v-row>
      <FeedLoadMore
        @intersect="onLoadMoreIntersected"
        :pending="$fetchState.pending"
      />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { FeedItem } from '~/types'
import ArtworkCard from '~/components/artwork/ArtworkCard.component.vue'
import FeedLoadMore from '~/components/feed/FeedLoadMore.component.vue'

@Component({
  components: {
    ArtworkCard,
    FeedLoadMore
  }
})
export default class ArtistFeed extends Vue {
  feed: FeedItem[] = []
  cursor?: string

  @Prop({
    type: String,
    required: true
  }) readonly address!: string

  async fetch() {
    this.feed.push(
      ...(await this.$artworkService.fetchFeed(this.address, this.cursor))
    )
  }

  private onLoadMoreIntersected(visible: boolean) {
    if (visible && this.feed.length > 0) {
      this.cursor = this.feed[this.feed.length - 1].cursor
      this.$fetch()
    }
  }
}
</script>
