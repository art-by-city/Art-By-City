<template>
  <v-container class="feed">
    <v-row
      v-for="(item, i) in feed"
      :key="item.guid"
      justify="center"
    >
      <v-col cols="12" md="6">
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
import { Component, Vue } from 'nuxt-property-decorator'
import _ from 'lodash'

import { ArtworkCard } from '~/components/artwork'
import { FeedItem } from '~/app/core'
import FeedLoadMore from './FeedLoadMore.component.vue'

@Component({
  components: {
    ArtworkCard,
    FeedLoadMore
  }
})
export default class FeedComponent extends Vue {
  feed: FeedItem[] = []
  cursor?: string
  cursorV0?: string

  fetchOnServer = false
  async fetch() {
    try {
      const { feed, cursor, cursorV0 } = await this.$artworkService.fetchFeed(
        null,
        this.cursor,
        this.cursorV0,
        5
      )
      this.feed.push(...feed)
      this.cursor = cursor
      this.cursorV0 = cursorV0
    } catch (error) {
      console.error(error)
      this.$toasts.error(error)
    }
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
