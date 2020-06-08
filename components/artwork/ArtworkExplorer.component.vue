<template>
  <v-flex xs12 sm8 md6>
    <v-dialog
      v-model="artworkPreview.show"
      max-width="80vw"
      content-class="artwork-preview-dialog"
      @click:outside="resetPreview"
    >
      <v-card flat dark>
        <v-img :src="previewImageSource" max-height="65vh" contain></v-img>
        <v-card-title>
          <LikeButton :dark="true" :artwork="previewArtwork" />
          <nuxt-link class="white--text" :to="`/artwork/${previewArtwork.id}`">
            {{ previewArtwork.title }}
          </nuxt-link>
        </v-card-title>
        <v-card-subtitle>
          <v-icon>mdi-brush</v-icon>
          {{ previewArtwork.owner.username }}
        </v-card-subtitle>
        <v-card-actions>
          <v-container class="pa-0">
            <v-row justify="center" dense>
              <v-col
                v-for="(image, i) in previewArtwork.images"
                :key="i"
                style="flex-grow: 0"
              >
                <v-img
                  max-width="100"
                  max-height="100"
                  :src="'/artwork-images/' + image.source"
                  class="clickable"
                  :class="isHighlighted(i)"
                  @click="previewImage(i)"
                ></v-img>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ArtworkExplorerToolbar :gridsize.sync="gridSize" @refresh="refresh" />
    <v-container fluid>
      <v-row dense>
        <v-col
          v-for="(artwork, i) in artworks.slice(0, gridSize)"
          :key="i"
          cols="4"
        >
          <v-hover>
            <template v-slot:default="{ hover }">
              <v-card class="artwork-card">
                <v-img
                  :src="'/artwork-images/' + artwork.images[0].source"
                  width="500"
                  height="500"
                  style="cursor: pointer"
                  @click="showArtworkPreview(i)"
                >
                  <v-fade-transition>
                    <v-overlay v-if="hover" absolute class="artwork-overlay">
                      <v-row align="end" class="fill-height pa-1">
                        <v-col>
                          <LikeButton :dark="true" :artwork="artwork" />
                          <a class="white--text">
                            {{ artwork.title }}
                          </a>
                        </v-col>
                      </v-row>
                    </v-overlay>
                  </v-fade-transition>
                </v-img>
              </v-card>
            </template>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </v-flex>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from 'nuxt-property-decorator'

import LikeButton from '../likeButton.component.vue'
import ArtworkExplorerToolbar from './ArtworkExplorerToolbar.component.vue'

@Component({
  components: {
    LikeButton,
    ArtworkExplorerToolbar
  }
})
export default class ArtworkExplorer extends Vue {
  @PropSync('initial', { type: Array }) artworks!: any[]

  artworkPreview = {
    show: false,
    index: -1,
    imageIndex: 0
  }

  gridSize = 3

  async refresh() {
    try {
      const { payload } = await this.$axios.$get('/api/artwork')

      this.artworks = payload
    } catch (error) {
      console.error(error)
    }
  }

  isHighlighted(index: number) {
    return this.artworkPreview.imageIndex === index ? 'highlighted' : ''
  }

  previewImage(index: number) {
    this.artworkPreview.imageIndex = index
  }

  resetPreview() {
    this.artworkPreview.imageIndex = 0
  }

  get previewImageSource() {
    if (
      this.artworkPreview.index >= 0 &&
      this.artworks.length > this.artworkPreview.index
    ) {
      return (
        '/artwork-images/' +
        this.artworks[this.artworkPreview.index].images[
          this.artworkPreview.imageIndex
        ].source
      )
    } else {
      return ''
    }
  }

  get previewArtwork() {
    if (
      this.artworkPreview.index >= 0 &&
      this.artworks.length > this.artworkPreview.index
    ) {
      return this.artworks[this.artworkPreview.index]
    } else {
      return { title: '', owner: { username: '' }, images: [] }
    }
  }

  set previewArtwork(artwork) {
    if (
      this.artworkPreview.index >= 0 &&
      this.artworks.length > this.artworkPreview.index
    ) {
      this.artworks[this.artworkPreview.index] = artwork
    }

    this.$forceUpdate()
  }

  showArtworkPreview(index: number) {
    this.artworkPreview.index = index
    this.toggleArtworkPreviewModal(true)
  }

  toggleArtworkPreviewModal(open?: boolean) {
    if (typeof open !== 'undefined') {
      this.artworkPreview.show = !!open
    } else {
      this.artworkPreview.show = !this.artworkPreview.show
    }
  }
}
</script>

<style>
.clickable {
  cursor: pointer;
}

.highlighted {
  border: 2px solid yellow;
}

.clickable:not(.highlighted) {
  margin: 2px;
}

.overlay-title {
  color: white;
}

.artwork-overlay > div.v-overlay__content {
  height: 100%;
  width: 100%;
}

.artwork-overlay div.artwork-container {
  height: 100%;
}

.artwork-preview-dialog {
  width: auto;
}

.artwork-preview-dialog > * {
  width: auto;
}
</style>
