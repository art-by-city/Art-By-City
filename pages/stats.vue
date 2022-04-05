<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="6">
        <div>
          <h3>Total Users</h3>
          <span>{{ totalUsers }}</span>
        </div>
        <div>
          <h3>Total Published Artists</h3>
          <span>{{ totalPublishedArtists }}</span>
        </div>
        <div>
          <h3>Total Artwork Publications</h3>
          <span>{{ totalPublications }}</span>
        </div>
        <div>
          <h3>Total Likes</h3>
          <span>{{ totalLikes }}</span>
        </div>
        <div>
          <h3>Total Earned From Likes</h3>
          <CurrencyEstimate :winston="totalEarnedFromLikes" />
        </div>
        <div>
          <h3>Total Tips</h3>
          <span>{{ totalTips }}</span>
        </div>
        <div>
          <h3>Total Earned From Tips</h3>
          <CurrencyEstimate :winston="totalEarnedFromTips" />
        </div>
        <div>
          <h3>Total Earned</h3>
          <CurrencyEstimate :winston="totalEarned" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ArdbTransaction from 'ardb/lib/models/transaction'
import _ from 'lodash'

const APP_NAME = 'ArtByCity'

const filterByTag = (
  tagName: string,
  tagValue: string
) => (tx: ArdbTransaction): boolean => {
  try {
    const matchingTag = tx.tags.find(tag => tagName === tag.name)

    return tagValue === matchingTag?.value
  } catch (err) {
    return false
  }
}

@Component({ middleware: 'role/admin' })
export default class StatsPage extends Vue {
  totalUsers: number = 0
  totalPublishedArtists: number = 0
  totalPublications: number = 0
  totalLikes: number = 0
  totalEarnedFromLikes: string = '0'
  totalTips: number = 0
  totalEarnedFromTips: string = '0'
  totalEarned: string = '0'

  fetchOnServer = false
  async fetch() {
    const query = this.$ardb.search('transactions').appName(APP_NAME)

    const txs = await query.findAll({
      sort: 'HEIGHT_DESC'
    }) as ArdbTransaction[]

    const addresses = _
      .chain(txs)
      .map(tx => tx.owner.address)
      .uniq()
      .value()
    this.totalUsers = addresses.length

    const publications = _
      .chain(txs)
      .filter(filterByTag('Category', 'artwork'))
      .uniqBy('id')
      .value()
    this.totalPublications = publications.length
    this.totalPublishedArtists = _
      .chain(publications)
      .map(tx => tx.owner.address)
      .uniq()
      .value()
      .length

    const likes = _
      .chain(txs)
      .filter(filterByTag('Category', 'like'))
      .uniqBy('id')
      .value()
    this.totalLikes = likes.length
    this.totalEarnedFromLikes = _
      .chain(likes)
      .map(tx => tx.quantity.winston)
      .reduce(
        (sum, quantity) => {
          return this.$arweave.ar.add(sum, quantity)
        },
        '0'
      )
      .value()

    const tips = _
      .chain(txs)
      .filter(filterByTag('Category', 'tip'))
      .uniqBy('id')
      .value()
    this.totalTips = tips.length
    this.totalEarnedFromTips = _
      .chain(tips)
      .map(tx => tx.quantity.winston)
      .reduce(
        (sum, quantity) => {
          return this.$arweave.ar.add(sum, quantity)
        },
        '0'
      )
      .value()

    this.totalEarned = this.$arweave.ar.add(
      this.totalEarnedFromLikes,
      this.totalEarnedFromTips
    )
  }
}
</script>
