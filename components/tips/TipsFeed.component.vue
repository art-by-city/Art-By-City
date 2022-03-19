<template>
  <v-container class="feed">
    <v-row>
      <v-col cols="auto">
        <b>Total</b>
      </v-col>
      <v-col cols="auto">
        {{ total }} <b>AR</b>
      </v-col>
    </v-row>
    <v-row
      v-for="(item, i) in feed"
      :key="item.guid"
    >
      <v-col cols="auto">
        {{ item.amount }} <b>AR</b>
      </v-col>
      <v-col cols="auto">
        <UserAvatar :key="i" dense :user="{ address: item.from }" />
      </v-col>
      <v-col cols="auto">
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
      />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { FeedItem, Tip } from '~/types'
import FeedLoadMore from '~/components/feed/FeedLoadMore.component.vue'

@Component({
  components: {
    FeedLoadMore
  }
})
export default class TipsFeed extends Vue {
  feed: (FeedItem & Tip)[] = []
  cursor?: string

  get total() {
    return this.$arweave.ar.winstonToAr(
      this.feed.map(item => item.amount).reduce((sum, amount) => {
        const amountWinston = this.$arweave.ar.arToWinston(amount)
        return this.$arweave.ar.add(sum, amountWinston)
      }, '0'),
      { formatted: true, decimals: 4 }
    )
  }

  @Prop({
    type: String,
    required: true
  }) readonly address!: string

  fetchOnServer = false
  async fetch() {
    const tips = await this.$tipsService.fetchFeed(this.address, this.cursor)

    this.feed.push(...tips)
  }

  onLoadMoreIntersected(visible: boolean) {
    if (visible && this.feed.length > 0) {
      this.cursor = this.feed[this.feed.length - 1].cursor
      this.$fetch()
    }
  }
}
</script>

<style scoped>
.adjust-icon {
  margin-top: -3px;
}
</style>
