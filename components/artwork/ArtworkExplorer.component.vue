<template>
  <v-container fluid class="artwork-explorer-container">
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
          :class="getArtworkCardClasses(i)"
        >
          <ArtworkCard
            :artwork="artwork"
            :baseUrl="baseUrl"
            :disabled="!isCurrentArtworkCard(i)"
            @click="onArtworkCardClicked(artwork, i)"
          />
        </div>
        <div v-if="searched && _artworks.length < 1" class="text-h1">
          no results
          <v-icon class="very-big-icon" color="black">
            mdi-emoticon-frown
          </v-icon>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'nuxt-property-decorator'
import _ from 'lodash'

import ArtworkExplorerToolbar from './ArtworkExplorerToolbar.component.vue'
import ArtworkCard from './ArtworkCard.component.vue'
import ArtworkOptions from '../../models/artwork/artworkOptions'
import { debounce } from '~/helpers/helpers'

@Component({
  components: {
    ArtworkExplorerToolbar,
    ArtworkCard
  }
})
export default class ArtworkExplorer extends Vue {
  @PropSync('initial', { type: Array }) artworks!: any[]
  @PropSync('options', { type: Object }) opts!: any

  @Prop({
    type: String,
    required: true
  }) readonly baseUrl!: string

  modalArtwork: any | null = null
  searched: boolean = false

  get _artworks() {
    return this.$store.state.artworks.list
  }

  private getArtworkCardClasses(index: number) {
    const isLeft = index < this.$store.state.artworks.currentArtworkIndex
    const isRight = index > this.$store.state.artworks.currentArtworkIndex
    const leftOffset = this.$store.state.artworks.currentArtworkIndex - index
    const rightOffset = index - this.$store.state.artworks.currentArtworkIndex

    return {
      'left-artwork': isLeft,
      [`left-${leftOffset}`]: isLeft,
      'current-artwork': this.isCurrentArtworkCard(index),
      'right-artwork': isRight,
      [`right-${rightOffset}`]: isRight
    }
  }

  private isCurrentArtworkCard(index: number) {
    return index === this.$store.state.artworks.currentArtworkIndex
  }

  @debounce
  previous(skip: number = 0) {
    this.$store.commit('artworks/previous', skip)
  }

  @debounce
  next(skip: number = 0) {
    this.$store.commit('artworks/next', skip)
  }

  @debounce
  fetchMore() {
    this.$store.dispatch('artworks/fetchMore')
  }

  @debounce
  onArtworkCardClicked(artwork: any, index: number) {
    const requestNewArtworkThreshold = 5
    const currentArtworkIndex = this.$store.state.artworks.currentArtworkIndex
    if (index === currentArtworkIndex) {
      this.$router.push(`/a/${artwork.id}`)
    } else if (index < currentArtworkIndex) {
      this.previous(currentArtworkIndex - index - 1)
    } else if (index > currentArtworkIndex) {
      this.next(index - currentArtworkIndex - 1)
      if (
        this.$store.state.artworks.list.length
        - index < requestNewArtworkThreshold
      ) {
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
