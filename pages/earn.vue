<template>
  <v-container class="earn-page">
    <v-row dense justify="center">
      <v-col cols="12" sm="8" offset-sm="2">
        <v-row dense>
          <v-col cols="auto">
            <h1>Total Earned</h1>
          </v-col>
          <v-col cols="auto" align-self="center">
            <CurrencyEstimate :winston="total" />
          </v-col>
        </v-row>
        <v-row dense>
          <v-tabs v-model="tab" color="black">
            <v-tab>Tips</v-tab>
            <v-tab>Likes</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-data-table
                class="mt-4"
                :headers="tips.headers"
                :items="tips.items"
              >
                <template v-slot:top>
                  <CurrencyEstimate class="mx-4" :winston="tipsTotal" />
                </template>

                <template v-slot:item.amount="{ item }">
                  <span>
                    {{ $arweave.ar.winstonToAr(item.amount, { decimals: 4 }) }}
                    <b>AR</b>
                  </span>
                </template>

                <template v-slot:item.usd="{ item }">
                  {{ usdEstimate(item.amount) }}
                </template>

                <template v-slot:item.from="{ item }">
                  <UserAvatar dense :user="{ address: item.from }" />
                </template>

                <template v-slot:item.txId="{ item }">
                  <a
                    :href="`https://viewblock.io/arweave/tx/${item.txId}`"
                    target="_blank"
                  >
                    ViewBlock
                    <v-icon small dense class="adjust-icon">
                      mdi-open-in-new
                    </v-icon>
                  </a>
                </template>

                <template v-slot:item.timestamp="{ item }">
                  <DateWithTooltip :date="item.timestamp*1000" />
                </template>
              </v-data-table>
            </v-tab-item>

          <v-tab-item>
            <v-data-table
              class="mt-4"
              :headers="likes.headers"
              :items="likes.items"
            >
                <template v-slot:top>
                  <CurrencyEstimate class="mx-4" :winston="likesTotal" />
                </template>

                <template v-slot:item.amount="{ item }">
                  <span>
                    {{ $arweave.ar.winstonToAr(item.amount, { decimals: 4 }) }}
                    <b>AR</b>
                  </span>
                </template>

                <template v-slot:item.usd="{ item }">
                  {{ usdEstimate(item.amount) }}
                </template>

                <template v-slot:item.entityTxId="{ item }">
                  <nuxt-link :to="artworkUrl(item.entityTxId)">
                    {{ artworkTitle(item.entityTxId) }}
                  </nuxt-link>
                </template>

                <template v-slot:item.from="{ item }">
                  <UserAvatar dense :user="{ address: item.from }" />
                </template>

                <template v-slot:item.txId="{ item }">
                  <a
                    :href="`https://viewblock.io/arweave/tx/${item.txId}`"
                    target="_blank"
                  >
                    ViewBlock
                    <v-icon small dense class="adjust-icon">
                      mdi-open-in-new
                    </v-icon>
                  </a>
                </template>

                <template v-slot:item.timestamp="{ item }">
                  <DateWithTooltip :date="item.timestamp*1000" />
                </template>
            </v-data-table>
          </v-tab-item>
          </v-tabs-items>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { Artwork, FeedItem, LegacyArtwork, LikeWithTip, Tip } from '~/app/core'
import { convertARtoUSD } from '~/app/util'

@Component({
  middleware: 'auth',
})
export default class EarnPage extends Vue {
  tab: null | string = null
  tips: {
    headers: any[]
    items: (FeedItem & Tip)[]
    cursor?: string
    forceCache: boolean
    hasMore: boolean
  } = {
    headers: [
      { text: 'AR',          value: 'amount',    sortable: true  },
      { text: 'USD',         value: 'usd',       sortable: false },
      { text: 'From',        value: 'from',      sortable: true  },
      { text: 'Transaction', value: 'txId',      sortable: false },
      { text: 'Time',        value: 'timestamp', sortable: true  },
    ],
    items: [],
    forceCache: false,
    hasMore: true,
  }
  likes: {
    headers: any[]
    items: (FeedItem & LikeWithTip)[]
    cursor?: string
    forceCache: boolean
    hasMore: boolean
  } = {
    headers: [
      { text: 'AR',          value: 'amount',     sortable: true  },
      { text: 'USD',         value: 'usd',        sortable: false },
      { text: 'For',         value: 'entityTxId', sortable: true  },
      { text: 'From',        value: 'from',       sortable: true  },
      { text: 'Transaction', value: 'txId',       sortable: false },
      { text: 'Time',        value: 'timestamp',  sortable: true  },
    ],
    items: [],
    forceCache: false,
    hasMore: true,
  }
  artwork: { [id: string]: Artwork | LegacyArtwork } = {}

  get tipsTotal(): string {
    return this.tips.items
      .reduce((sum, item) => this.$arweave.ar.add(sum, item.amount), '0')
  }

  get likesTotal(): string {
    return this.likes.items
      .reduce((sum, item) => this.$arweave.ar.add(sum, item.amount), '0')
  }

  get total(): string {
    return this.$arweave.ar.add(this.tipsTotal, this.likesTotal)
  }

  fetchOnServer = false
  async fetch() {
    const tips = await this.$tipsService.fetchFeed(
      this.$auth.user.address,
      this.tips.cursor,
      this.tips.forceCache,
      100
    )

    if (tips.length < 1) {
      this.tips.hasMore = false
    }

    this.tips.items.push(...tips)

    const likes = await this.$likesService.fetchAllLikesReceived(
      this.$auth.user.address
    )

    if (likes.length < 1) {
      this.likes.hasMore = false
    }

    this.likes.items.push(...likes)

    await Promise.all(this.likes.items.map(async item => {
      const artwork = await this.$artworkService.fetch(item.entityTxId)
      if (artwork) {
        this.artwork[item.entityTxId] = artwork
      }
    }))
  }

  usdEstimate(winston: string) {
    if (winston && this.$priceService.priceUSD) {
      return convertARtoUSD(
        this.$arweave.ar.winstonToAr(winston),
        this.$priceService.priceUSD
      )
    }

    return ''
  }

  artworkTitle(entityTxId: string): string {
    return this.artwork[entityTxId]?.title || entityTxId
  }

  artworkUrl(entityTxId: string): string {
    const user = this.$auth.user.username || this.$auth.user.address
    const artwork = this.artwork[entityTxId]?.slug || entityTxId

    return `/${user}/${artwork}`
  }
}
</script>

<style scoped>
.adjust-icon {
  margin-top: -4px;
}
</style>
