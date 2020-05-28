<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-dialog v-model="artworkPreview.show" max-width="600">
        <v-hover :value="true">
          <template v-slot:default="{ hover }">
            <v-card min-height="200px" max-height="90vh" flat dark>
              <v-img
                :src="previewImageSource"
                max-height="90vh"
                max-width="90vh"
                contain
              ></v-img>
              <v-fade-transition>
                <v-overlay
                  v-if="hover"
                  absolute
                  class="artwork-preview-overlay"
                >
                  <v-container
                    fluid
                    fill-height
                    class="artwork-preview-container"
                  >
                    <v-row align="start" align-content="start">
                      <v-col cols="12">
                        <v-card-title class="overlay-title">
                          <v-btn icon><v-icon>mdi-heart</v-icon></v-btn>
                          {{ previewArtwork.title }}
                        </v-card-title>
                      </v-col>
                    </v-row>
                    <v-row align="end">
                      <v-col
                        v-for="(image, i) in previewArtwork.images"
                        :key="i"
                        justify="start"
                        cols="1"
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
                </v-overlay>
              </v-fade-transition>
            </v-card>
          </template>
        </v-hover>
      </v-dialog>
      <v-container fluid>
        <v-row dense>
          <v-col v-for="(artwork, i) in artworks" :key="i" cols="4">
            <v-hover>
              <template v-slot:default="{ hover }">
                <v-card>
                  <v-img
                    :src="'/artwork-images/' + artwork.images[0].source"
                    width="500"
                    height="500"
                  ></v-img>
                  <v-fade-transition>
                    <v-overlay v-if="hover" absolute>
                      <v-btn icon><v-icon>mdi-heart</v-icon></v-btn>
                      <v-btn icon @click="showArtworkPreview(i)">
                        <v-icon>mdi-arrow-expand</v-icon>
                      </v-btn>
                    </v-overlay>
                  </v-fade-transition>
                </v-card>
              </template>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import PageComponent from '~/components/pages/page.component'

@Component
export default class HomePage extends PageComponent {
  artworks: any[] = []
  artworkPreview = {
    show: false,
    index: -1,
    imageIndex: 0
  }

  async asyncData({ $axios }: Context) {
    try {
      const { payload } = await $axios.$get('/api/artwork')

      return { artworks: payload }
    } catch (error) {
      return { errors: error.response.data.messages }
    }
  }

  isHighlighted(index: number) {
    return this.artworkPreview.imageIndex === index ? 'highlighted' : ''
  }

  previewImage(index: number) {
    this.artworkPreview.imageIndex = index
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
      return { images: [] }
    }
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
  border: 2px solid black;
}

.overlay-title {
  color: white;
}

.artwork-preview-overlay > div.v-overlay__content {
  height: 100%;
  width: 100%;
}

.artwork-preview-overlay div.artwork-preview-container {
  height: 100%;
  align-items: normal;
}
</style>
