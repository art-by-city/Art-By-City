<template>
  <v-container fluid class="artwork-explorer-container">
    <ArtworkModal :artwork.sync="modalArtwork" />
    <ArtworkExplorerToolbar
      :gridsize.sync="gridSize"
      :opts.sync="opts"
      @refresh="refresh"
      @previous="previous"
    />
    <v-divider></v-divider>
    <div class="artwork-explorer-container" :class="{ [`grid-size-${gridSize}`]: true }">
      <div class="artwork-grid-row">
        <div
          class="artwork-grid-col"
          :class="{
            ['artwork-card-out-left']: isFetching,
            ['artwork-card-out-right']: isLoading,
            ['artwork-card-no-animate']: !shouldAnimate
          }"
          v-for="(artwork, i) in sliceArtworks()"
          :key="i"
        >
          <ArtworkCard :artwork="artwork" @click="onArtworkCardClicked(artwork)" />
        </div>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from 'nuxt-property-decorator'

import ArtworkExplorerToolbar from './ArtworkExplorerToolbar.component.vue'
import ArtworkCard from './ArtworkCard.component.vue'
import ArtworkModal from './ArtworkModal.component.vue'
import ArtworkOptions from '../../models/artwork/artworkOptions'

@Component({
  components: {
    ArtworkExplorerToolbar,
    ArtworkCard,
    ArtworkModal
  }
})
export default class ArtworkExplorer extends Vue {
  @PropSync('initial', { type: Array }) artworks!: any[]
  @PropSync('options', { type: Object }) opts!: any

  modalArtwork: any | null = null

  gridSize = 1

  vw = 1000

  isFetching: boolean = false
  isLoading: boolean = false
  shouldAnimate: boolean = true

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
  }

  previous() {
    if (!this.$store.state.artworks.isPrevBeingViewed) {
      // BACKWARDS
      this.shouldAnimate = true
      this.isLoading = true
      setTimeout((() => {
        this.$store.commit('artworks/previous')
        this.shouldAnimate = false
        this.isFetching = true
        this.isLoading = false
        setTimeout((() => {
          this.shouldAnimate = true
          this.isFetching = false
        }).bind(this), 500)
      }).bind(this), 500)
    } else {
      // FORWARDS
      this.shouldAnimate = true
      this.isFetching = true
      setTimeout((() => {
        this.$store.commit('artworks/previous')
        this.shouldAnimate = false
        this.isLoading = true
        this.isFetching = false
        setTimeout((() => {
          this.shouldAnimate = true
          this.isLoading = false
        }).bind(this), 500)
      }).bind(this), 500)
    }
  }

  sliceArtworks(slot?: string) {
    const artworks = this.$store.state.artworks.list

    return artworks.slice(0, 3)

    // if (this.vw < 960) {
    //   return artworks.slice(0, 1)
    // }

    // if (this.gridSize === 1) {
    //   // return [ artworks.length > 1 ? artworks[1] : artworks[0] ]
    //   return artworks.slice(0, 3)
    // }

    // return artworks.slice(0, this.gridSize)
  }

  onArtworkCardClicked(artwork: any) {
    this.modalArtwork = artwork
  }

  async refresh(opts: ArtworkOptions) {
    this.shouldAnimate = true
    this.isFetching = true
    this.$store.commit('artworks/options', opts)
    setTimeout((async () => {
      await this.$store.dispatch('artworks/fetchArtworks')
      this.shouldAnimate = false
      this.isLoading = true
      this.isFetching = false
      setTimeout((() => {
        this.shouldAnimate = true
        this.isLoading = false
      }).bind(this), 500)
    }).bind(this), 500)
  }
}
</script>

<style scoped>
.artwork-explorer-container {
  margin: auto;
  height: 100%;
}
.artwork-grid-row {
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.artwork-grid-col {
  display: inline-block;
}
.artwork-explorer-container.grid-size-1 {
  width: 100%;
  height: 95%;
}
.grid-size-1 >>> .artwork-grid-col {
  height: 39vw;
  width: 39vw;
  margin: 0 auto;
}
.grid-size-1 >>> .artwork-grid-col:nth-child(2) {
  position: relative;
  right: -30vw;
  height: 30vw;
  width: 30vw;
  opacity: 0;
  transition: opacity .5s ease-out 1s, right .5s ease-out .5s;
}
.grid-size-1 >>> .artwork-grid-col:nth-child(3) {
  position: relative;
  right: 30vw;
  height: 30vw;
  width: 30vw;
  opacity: 0;
  transition: opacity .5s ease-out 1s, right .5s ease-out .5s;
}
.artwork-explorer-container.grid-size-3 {
  width: 100%;
  height: 95%;
}
.grid-size-3 >>> .artwork-grid-col {
  padding: 5px;
}
.grid-size-3 >>> .artwork-grid-col:first-child {
  height: 30vw;
  width: 30vw;
}
.artwork-grid-col {
  order: 3;
  z-index: 1;
}
.artwork-grid-col:first-child {
  order: 2;
  z-index: 3;
}
.artwork-grid-col:nth-child(2) {
  order: 1;
  z-index: 2;
}
.artwork-grid-col:first-child {
  position: relative;
  right: 0vw;
  transition: height .5s ease-out, width .5s ease-out, right .5s ease-out;
}
.grid-size-1 >>> .artwork-grid-col:first-child {
  transition: height .5s ease-out, width .5s ease-out, right .5s ease-out;
}
.grid-size-3 >>> .artwork-grid-col:not(:first-child) {
  position: relative;
  right: 0vw;
  height: 30vw;
  width: 30vw;
  transition: right .5s ease-out;
}

/* Timeline Transitions */
.artwork-card-out-left {
  position: relative !important;
  right: 100vw !important;
  transition: right .5s ease-out;
}
.artwork-card-out-right {
  position: relative !important;
  right: -100vw !important;
}
.artwork-card-no-animate {
  animation: none !important;
  transition: none !important;
}
</style>
