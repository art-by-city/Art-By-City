<template>
  <v-container fluid class="artwork-explorer-container">
    <!-- <ArtworkModal :artwork.sync="modalArtwork" /> -->
    <ArtworkExplorerToolbar
      :opts.sync="opts"
      @refresh="refresh"
      @previous="previous"
    />
    <v-divider></v-divider>
    <div class="artwork-explorer-container">
      <div class="artwork-grid-row">
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
        <div v-if="searched && _artworks.length < 1" class="text-h1">
          no results <v-icon class="very-big-icon" color="black">mdi-emoticon-frown</v-icon>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from 'nuxt-property-decorator'
import _ from 'lodash'

import ArtworkExplorerToolbar from './ArtworkExplorerToolbar.component.vue'
import ArtworkCard from './ArtworkCard.component.vue'
import ArtworkModal from './ArtworkModal.component.vue'
import ArtworkOptions from '../../models/artwork/artworkOptions'
import { debounce } from '~/helpers/helpers'

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
  searched: boolean = false

  get _artworks() {
    return this.$store.state.artworks.list
  }

  @debounce
  previous() {
    this.$store.commit('artworks/previous')
  }

  @debounce
  next() {
    this.$store.commit('artworks/next')
  }

  @debounce
  fetchMore() {
    this.$store.dispatch('artworks/fetchMore')
  }

  @debounce
  onArtworkCardClicked(artwork: any, index: number) {
    const requestNewArtworkThreshold = 5
    if (index === this.$store.state.artworks.currentArtworkIndex) {
      // this.modalArtwork = artwork
      this.$router.push(`/artwork/${artwork.id}`)
    } else if (index < this.$store.state.artworks.currentArtworkIndex) {
      this.previous()
    } else if (index > this.$store.state.artworks.currentArtworkIndex) {
      this.next()
      if (this.$store.state.artworks.list.length - index < requestNewArtworkThreshold) {
        this.fetchMore()
      }
    }
  }

  @debounce
  async refresh(opts: ArtworkOptions) {
    this.searched = true
    this.$store.commit('artworks/options', opts)
    await this.$store.dispatch('artworks/fetch')
  }
}
</script>

<style scoped>
.text-h1 {
  font-family: Roboto;
  font-weight: 300;
  font-size: 6rem;
  letter-spacing: -0.09375rem;
}
.very-big-icon {
  font-size: 6rem;
  position: relative;
  top: -10px;
}

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
  opacity: 0.5;
}
.artwork-grid-col.left-artwork {
  left: -15vw;
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
  left: 104vw;
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
