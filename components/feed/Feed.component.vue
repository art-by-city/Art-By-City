<template>
  <v-container class="feed">
    <v-row v-for="(post, i) in feed" :key="post.guid" justify="center">
      <v-col cols="6">
        <ArtworkCard :artwork="post.artwork" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import ArtworkCard from '~/components/artwork/ArtworkCard.component.vue'
import ProgressService from '~/services/progress/service'
import { FeedItem } from '~/types'

@Component({
  components: {
    ArtworkCard
  }
})
export default class FeedComponent extends Vue {
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
