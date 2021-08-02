<template>
  <div class="index-page-wrapper" style="height: 100%">
    <h2>Recent Publications</h2><v-btn @click="$fetch">refresh</v-btn>
    <v-card v-for="(post, i) in feed" :key="i">
      <v-card-title v-if="post.artwork.creator">
        <nuxt-link :to="'/'+post.artwork.creator.address+'/'+post.tx.id">
          {{ post.artwork.title }}
        </nuxt-link>
      </v-card-title>
      <v-card-subtitle v-if="post.artwork.creator">
        Artist:
        <nuxt-link :to="'/'+post.artwork.creator.address">
          {{ post.artwork.creator.address }}
        </nuxt-link>
      </v-card-subtitle>
      <v-card-text>
        <img
          v-if="post.artwork.images && post.artwork.images.length > 0"
          :src="post.artwork.images[0].dataUrl"
        />
        {{ post.artwork.description }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import Transaction from 'arweave/node/lib/transaction'

import PageComponent from '~/components/pages/page.component'
import { Artwork } from '~/types'

@Component
export default class HomePage extends PageComponent {
  feed: { tx: Transaction, artwork: Artwork }[] = []
  async fetch() {
    try {
      this.feed = []
      const txs = await this.$ardb
        .search('transactions')
        .appName('ArtByCity')
        .type('application/json')
        .find()
      for (const tx of txs) {
        const res = await this.$arweave.api.get(tx.id)
        const _tx = await this.$arweave.transactions.get(tx.id)
        this.feed.push({ tx: _tx, artwork: res.data })
      }
    } catch (error) {
      console.error(error)
      this.$toastService.error(error)
    }
  }
}
</script>
