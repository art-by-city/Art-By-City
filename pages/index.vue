<template>
  <div class="index-page-wrapper" style="height: 100%">
    <h2 class="d-inline">Recent Publications</h2>

    <v-btn icon @click="$fetch" :disabled="$fetchState.pending">
      <v-icon :class="{ pending: $fetchState.pending }">mdi-refresh</v-icon>
    </v-btn>

    <v-container>
      <v-row>
        <v-col v-for="(post, i) in feed" :key="post.guid" cols="4">
          <ArtworkCard :artwork="post.artwork" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'

import PageComponent from '~/components/pages/page.component'
import ArtworkCard from '~/components/artwork/ArtworkCard.component.vue'
import { FeedItem } from '~/types'
import ProgressService from '~/services/progress/service'

@Component({
  components: {
    ArtworkCard
  }
})
export default class HomePage extends PageComponent {
  feed: FeedItem[] = []

  async fetch() {
    ProgressService.start()
    try {
      this.feed = await this.$artworkService.fetchArtworkFeed()
    } catch (error) {
      console.error(error)
      this.$toastService.error(error)
    } finally {
      ProgressService.stop()
    }
  }
}
</script>

<style scoped>
.pending {
  -webkit-animation:spin 1s linear infinite;
  -moz-animation:spin 1s linear infinite;
  animation:spin 1s linear infinite;
}
@-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
@-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
</style>
