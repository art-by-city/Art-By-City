<template>
  <div v-if="syncedArtwork">
    <v-dialog
      v-model="isShown"
      max-width="80vw"
      content-class="artwork-preview-dialog"
      @click:outside="close"
    >
      <v-card flat dark>
        <div class="img-container">
          <v-img :src="previewImageSource" max-height="65vh" contain></v-img>
        </div>
        <v-card-title>
          <LikeButton :dark="true" :artwork="syncedArtwork" />
          <nuxt-link
            class="white--text text-lowercase"
            :to="`/artwork/${syncedArtwork.id}`"
          >
            {{ syncedArtwork.title }}
          </nuxt-link>
        </v-card-title>
        <v-card-subtitle class="text-lowercase">
          <ArtistTag dark :user="syncedArtwork.owner" />
        </v-card-subtitle>
        <v-card-actions>
          <v-container class="pa-0">
            <v-row justify="center" dense>
              <v-col
                v-for="(image, i) in syncedArtwork.images"
                :key="i"
                style="flex-grow: 0"
              >
                <v-img
                  max-width="100"
                  max-height="100"
                  :src="'/artwork-images/' + image.source"
                  class="clickable"
                  :class="{ 'highlighted': imgIndex === i }"
                  @click="imgIndex = i"
                ></v-img>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from 'nuxt-property-decorator'

import LikeButton from '../likeButton.component.vue'

@Component({
  components: {
    LikeButton
  }
})
export default class ArtworkModal extends Vue {
  @PropSync('artwork', { default: null }) syncedArtwork!: any | null
  imgIndex: number = 0

  get isShown(): boolean {
    return !!this.syncedArtwork
  }

  close() {
    this.syncedArtwork = null
  }

  get previewImageSource() {
    if (this.syncedArtwork) {
      return `/artwork-images/${this.syncedArtwork.images[this.imgIndex].source}`
    }

    return ''
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
.highlighted {
  border: 2px solid yellow;
}
.clickable:not(.highlighted) {
  margin: 2px;
}
.artwork-preview-dialog {
  width: auto;
}
.artwork-preview-dialog > * {
  width: auto;
}
.img-container {
  height: 65vh;
}
</style>
