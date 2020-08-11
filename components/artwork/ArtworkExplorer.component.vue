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
    <div class="artwork-explorer-container">
      <div class="artwork-grid-row">
        <!-- <div
          class="artwork-grid-col"
          :class="{
            ['artwork-card-out-left']: isFetching,
            ['artwork-card-out-right']: isLoading,
            ['artwork-card-no-animate']: !shouldAnimate
          }"
          v-for="(artwork, i) in sliceArtworks()"
          :key="i"
        > -->
        <div
          v-for="(artwork, i) in _artworks"
          :key="i"
          class="artwork-grid-col"
          :class="{
            'left-artwork': i < $store.state.artworks.currentArtworkIndex,
            [`left-${$store.state.artworks.currentArtworkIndex - i}`]: i < $store.state.artworks.currentArtworkIndex,
            'current-artwork': i === $store.state.artworks.currentArtworkIndex,
            'right-artwork': i > $store.state.artworks.currentArtworkIndex,
            [`right-${i - $store.state.artworks.currentArtworkIndex}`]: i > $store.state.artworks.currentArtworkIndex
          }"
        >
          <ArtworkCard :artwork="artwork" @click="onArtworkCardClicked(artwork, i)" />
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

  get _artworks() {
    return this.$store.state.artworks.list
  }

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
    this.$store.commit('artworks/previous')
    // if (!this.$store.state.artworks.isPrevBeingViewed) {
    //   // BACKWARDS
    //   this.shouldAnimate = true
    //   this.isLoading = true
    //   setTimeout((() => {
    //     this.$store.commit('artworks/previous')
    //     this.shouldAnimate = false
    //     this.isFetching = true
    //     this.isLoading = false
    //     setTimeout((() => {
    //       this.shouldAnimate = true
    //       this.isFetching = false
    //     }).bind(this), 500)
    //   }).bind(this), 500)
    // } else {
    //   // FORWARDS
    //   this.shouldAnimate = true
    //   this.isFetching = true
    //   setTimeout((() => {
    //     this.$store.commit('artworks/previous')
    //     this.shouldAnimate = false
    //     this.isLoading = true
    //     this.isFetching = false
    //     setTimeout((() => {
    //       this.shouldAnimate = true
    //       this.isLoading = false
    //     }).bind(this), 500)
    //   }).bind(this), 500)
    // }
  }

  onArtworkCardClicked(artwork: any, index: number) {
    const requestNewArtworkThreshold = 5
    if (index === this.$store.state.artworks.currentArtworkIndex) {
      this.modalArtwork = artwork
    } else if (index < this.$store.state.artworks.currentArtworkIndex) {
      this.$store.commit('artworks/previous')
    } else if (index > this.$store.state.artworks.currentArtworkIndex) {
      this.$store.commit('artworks/next')
      if (this.$store.state.artworks.list.length - index < requestNewArtworkThreshold) {
        this.$store.dispatch('artworks/fetchMore')
      }
    }
  }

  async refresh(opts: ArtworkOptions) {
    this.shouldAnimate = true
    this.isFetching = true
    this.$store.commit('artworks/options', opts)
    setTimeout((async () => {
      await this.$store.dispatch('artworks/fetch')
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
  height: 99%;
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
  position: absolute;
  transition: all .5s ease-out;
  height: 10vw;
  width: 10vw;
}
.artwork-grid-col.current-artwork {
  left: 29vw;
  height: 41vw;
  width: 41vw;
}
.artwork-grid-col:not(.current-artwork) {
  opacity: 0.25;
}
.artwork-grid-col.left-artwork {
  left: -100vw;
}
.artwork-grid-col.left-artwork.left-1 {
  left: 18vw;
}
.artwork-grid-col.left-artwork.left-2 {
  left: 7vw;
}
.artwork-grid-col.left-artwork.left-3 {
  left: -4vw;
}
.artwork-grid-col.right-artwork {
  left: 100vw;
}
.artwork-grid-col.right-artwork.right-1 {
  left: 71vw;
}
.artwork-grid-col.right-artwork.right-2 {
  left: 82vw;
}
.artwork-grid-col.right-artwork.right-3 {
  left: 93vw;
}
</style>
