<template>
  <v-container>
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
          <nuxt-link
            class="white--text text-lowercase"
            :to="`/artwork/${previewArtwork.id}`"
          >
            {{ previewArtwork.title }}
          </nuxt-link>
        </v-card-title>
        <v-card-subtitle class="text-lowercase">
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
    <ArtworkExplorerToolbar
      :gridsize.sync="gridSize"
      :opts.sync="opts"
      @refresh="refresh"
      @previous="previous"
    />
    <v-divider></v-divider>
    <div class="artwork-explorer-container" :class="calcContainerClass()">
      <v-container>
        <v-row dense justify="center">
          <v-col
            v-for="(artwork, i) in sliceArtworks()"
            :key="i"
            justify="center"
            xs="12"
            md="4"
          >
            <v-hover>
              <template v-slot:default="{ hover }">
                <v-card
                  class="artwork-card"
                  :width="calcArtworkHeight()"
                  :height="calcArtworkHeight()"
                  flat
                >
                  <div :class="artworkFlipCardClass">
                    <div class="flip-card-inner">
                      <div class="flip-card-front">
                        <v-img
                          v-if="artwork"
                          :src="'/artwork-images/' + artwork.images[0].source"
                          style="cursor: pointer"
                          height="100%"
                          width="100%"
                          @click="showArtworkPreview(i)"
                        >
                          <v-fade-transition>
                            <v-overlay v-if="hover" absolute class="artwork-overlay">
                              <v-row align="end" class="fill-height pa-1">
                                <v-col class="artwork-overlay-title-container">
                                  <LikeButton :dark="true" :artwork="artwork" />
                                  <a class="white--text text-lowercase">
                                    {{ artwork.title }}
                                  </a>
                                </v-col>
                              </v-row>
                            </v-overlay>
                          </v-fade-transition>
                        </v-img>
                      </div>
                      <div class="flip-card-back">
                        <v-img
                          v-if="sliceArtworks('B')[i]"
                          :src="'/artwork-images/' + sliceArtworks('B')[i].images[0].source"
                          style="cursor: pointer"
                          height="100%"
                          width="100%"
                          @click="showArtworkPreview(i)"
                        >
                          <v-fade-transition>
                            <v-overlay v-if="hover" absolute class="artwork-overlay">
                              <v-row align="end" class="fill-height pa-1">
                                <v-col class="artwork-overlay-title-container">
                                  <LikeButton :dark="true" :artwork="artwork" />
                                  <a class="white--text text-lowercase">
                                    {{ artwork.title }}
                                  </a>
                                </v-col>
                              </v-row>
                            </v-overlay>
                          </v-fade-transition>
                        </v-img>
                      </div>
                    </div>
                  </div>
                </v-card>
              </template>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from 'nuxt-property-decorator'

import LikeButton from '../likeButton.component.vue'
import ArtworkExplorerToolbar from './ArtworkExplorerToolbar.component.vue'
import ArtworkOptions from '../../models/artwork/artworkOptions'

@Component({
  components: {
    LikeButton,
    ArtworkExplorerToolbar
  }
})
export default class ArtworkExplorer extends Vue {
  @PropSync('initial', { type: Array }) artworks!: any[]
  @PropSync('options', { type: Object }) opts!: any

  artworkPreview = {
    show: false,
    index: -1,
    imageIndex: 0
  }

  gridSize = 1

  vw = 1000
  vh = 1000

  showBackCards = false

  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
      this.onResize()
    })
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  }

  onResize() {
    this.vw = window.innerWidth
    this.vh = window.innerHeight
  }

  async refresh(opts: ArtworkOptions) {
    this.$store.commit('artworks/options', opts)
    await this.$store.dispatch('artworks/fetchArtworks')
  }

  previous() {
    this.$store.commit('artworks/previous')
  }

  sliceArtworks(slot?: string) {
    const artworks = !slot || slot === 'A'
      ? this.$store.state.artworks.slotA
      : this.$store.state.artworks.slotB

    if (this.vw < 960) {
      return artworks.slice(0, 1)
    }

    if (this.gridSize === 1) {
      return [ artworks.length > 1 ? artworks[1] : artworks[0] ]
    }

    return artworks.slice(0, this.gridSize)
  }

  calcContainerClass() {
    return { [`grid-size-${this.gridSize}`]: true }
  }

  calcArtworkHeight() {
    if (this.vw < 960) {
      return '70vh'
    }

    let available = this.vh
    if (this.vh > this.vw) {
      available = this.vw
    }
    let magic = 425
    if (this.gridSize === 6) {
      magic = 300
    } else if (this.gridSize === 9) {
      magic = 300
    }

    available = available - magic

    const h = available / (this.gridSize / 3)

    if (this.gridSize === 1) {
      return available
    }

    return h
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

  get artworkFlipCardClass() {
    return {
      'flip-card': true,
      'show-back-card': this.$store.state.artworks.visibleSlot === 'B'
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

.artwork-explorer-container {
  margin: auto;
}
.artwork-overlay-title-container {
  padding-bottom: 2px;
}

.artwork-explorer-container.grid-size-1 {
  width: 96%
}
.artwork-explorer-container.grid-size-3 {
  width: 96%;
}
.artwork-explorer-container.grid-size-6 {
  width: 60%;
}
.artwork-explorer-container.grid-size-9 {
  width: 41%;
}

/* The flip card container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
.flip-card {
  background-color: transparent;
  width: 100%;
  height: 100%;
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

/* Do an horizontal flip when you move the mouse over the flip box container */
.flip-card.show-back-card .flip-card-inner {
  transform: rotateY(180deg);
  /* animation: flip-in .5s; */
}
/* Style the back side */
.flip-card-back {
  transform: rotateY(180deg);
  /* animation: flip-in .5s; */
}

/* Position the front and back side */
.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;

  border-bottom-color:rgb(255, 255, 255);
  border-bottom-left-radius:4px;
  border-bottom-right-radius:4px;
  border-bottom-width:0px;
  border-left-color:rgb(255, 255, 255);
  border-left-width:0px;
  border-right-color:rgb(255, 255, 255);
  border-right-width:0px;
  border-top-color:rgb(255, 255, 255);
  border-top-left-radius:4px;
  border-top-right-radius:4px;
  border-top-width:0px;
  box-shadow:rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
  box-sizing:border-box;
}

.flip-enter-active {
  animation: flip-in .5s;
}
.flip-leave-active {
  animation: flip-in .5s reverse;
}
@keyframes flip-in {
  0% {
    transform: rotateY(180deg);
  }
  50% {
    transform: rotateY(90deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}
</style>
