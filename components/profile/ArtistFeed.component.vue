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
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'

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
  cursorV0?: string

  @Prop({
    type: String,
    required: true
  }) readonly address!: string

  @Emit('fetched') onFetched(count: number) {
    return count
  }

  fetchOnServer = false
  async fetch() {
    const { cursor, cursorV0, feed } = await this.$artworkService.fetchFeed(
      this.address,
      this.cursor,
      this.cursorV0
    )
    this.cursor = cursor
    this.cursorV0 = cursorV0
    this.feed.push(...feed)

    this.onFetched(this.feed.length)
  }

  onLoadMoreIntersected(visible: boolean) {
    if (
      visible
      && !this.$fetchState.pending
      && (this.cursor || this.cursorV0)
    ) {
      this.$fetch()
    }
  }
}
</script>
