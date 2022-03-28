<template>
  <v-container class="feed">
    <v-row>
      <v-col cols="auto">
        <b>Total</b>
      </v-col>
      <v-col cols="auto">
        <CurrencyEstimate :winston="totalWinston" />
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn icon small @click="onRefreshClicked">
          <v-icon dense>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row
      v-for="(item, i) in feed"
      :key="item.guid"
    >
      <v-col cols="4" md="auto">
        <CurrencyEstimate :winston="item.amount" />
      </v-col>
      <v-col cols="4" md="auto">
        <UserAvatar dense :user="{ address: item.from }" />
      </v-col>
      <v-col cols="4" md="auto" class="text-truncate">
        <a
          :href="`https://viewblock.io/arweave/tx/${item.txId}`"
          target="_blank"
        >
          {{ item.txId }}
          <v-icon small dense class="adjust-icon">
            mdi-open-in-new
          </v-icon>
        </a>
      </v-col>
    </v-row>

    <v-row>
      <FeedLoadMore
        @intersect="onLoadMoreIntersected"
        :pending="$fetchState.pending"
        :button="hasMore"
        @click="onLoadMoreIntersected(true)"
      />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { FeedItem, Tip } from '~/app/core'
import FeedLoadMore from '~/components/feed/FeedLoadMore.component.vue'
import { debounce } from '~/app/util'

@Component({
  components: {
    FeedLoadMore
  }
})
export default class TipsFeed extends Vue {
  feed: (FeedItem & Tip)[] = []
  cursor?: string
  forceCache: boolean = false
  hasMore: boolean = true

  get totalWinston() {
    return this.feed
      .reduce((sum, item) => this.$arweave.ar.add(sum, item.amount), '0')
  }

  @Prop({
    type: String,
    required: true
  }) readonly address!: string

  fetchOnServer = false
  async fetch() {
    const items = await this.$tipsService.fetchFeed(
      this.address,
      this.cursor,
      this.forceCache,
      100
    )

    if (items.length < 1) {
      this.hasMore = false
    }

    this.feed.push(...items)
  }

  onLoadMoreIntersected(visible: boolean) {
    if (visible && this.feed.length > 0) {
      this.cursor = this.feed[this.feed.length - 1].cursor
      this.$fetch()
    }
  }

  @debounce
  async onRefreshClicked() {
    this.cursor = undefined
    this.feed = []
    this.forceCache = true
    this.hasMore = true
    this.$fetch()
  }
}
</script>

<style scoped>
.adjust-icon {
  margin-top: -3px;
}
</style>
