<template>
  <v-container class="feed">
    <v-row
      v-for="(item, i) in feed"
      :key="item.guid"
      justify="center"
    >
      <v-col cols="6">
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

import ArtworkCard from '~/components/artwork/ArtworkCard.component.vue'
import ProgressService from '~/services/progress/service'
import { FeedItem } from '~/types'
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

  fetchOnServer = false
  async fetch() {
    ProgressService.start()
    try {
      this.feed.push(
        ...(await this.$artworkService.fetchFeed(null, this.cursor, 5))
      )
    } catch (error) {
      console.error(error)
      this.$toastService.error(error)
    } finally {
      ProgressService.stop()
    }
  }

  onLoadMoreIntersected(visible: boolean) {
    if (
      !this.$fetchState.pending
      && visible
      && this.feed.length > 0
    ) {
      const prevCursor = this.cursor
      const nextCursor = this.feed[this.feed.length - 1].cursor

      if (prevCursor !== nextCursor) {
        this.cursor = nextCursor
        this.$fetch()
      }
    }
  }
}
</script>
