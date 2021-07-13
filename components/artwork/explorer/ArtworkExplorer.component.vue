<template>
  <div class="artwork-explorer-wrapper">
    <ArtworkExplorerToolbar
      :opts.sync="opts"
      @refresh="refresh"
      @previous="previous"
      :dense="shouldToolbarBeDense"
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
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'nuxt-property-decorator'
import _ from 'lodash'

import ArtworkExplorerToolbar from './ArtworkExplorerToolbar.component.vue'
import ArtworkCard from '../ArtworkCard.component.vue'
import ArtworkOptions from '~/models/artwork/artworkOptions'
import { debounce, isTouchDevice } from '~/helpers/helpers'

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

  @Prop({
    type: String,
    required: true
  }) readonly displayBreakpoint!: string

  modalArtwork: any | null = null
  searched: boolean = false

  get shouldToolbarBeDense(): boolean {
    switch (this.displayBreakpoint) {
      case 'xs': return true
      case 'sm': return true
      case 'md': return false
      case 'lg': return false
      case 'xl': return false
        default: return false
    }
  }

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
      [`right-${rightOffset}`]: isRight,
      [`artwork-${this.displayBreakpoint}`]: true
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
      const idOrSlug = artwork.slug || artwork.id
      this.$router.push(`/${artwork.owner.username}/${idOrSlug}`)
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

.artwork-explorer-wrapper {
  margin: auto;
  height: 99%;
  width: 100%;
  max-width: 100%;
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
  position: relative;
  overflow-x: hidden;
}
.artwork-grid-col {
  display: inline-block;
  position: absolute;
  transition: all .5s ease-out;
  height: 10vw;
  width: 10vw;

  /* border: 1px solid red; */
}
.artwork-grid-col.current-artwork {
  left: 29vw;
  height: 41vw;
  width: 41vw;
}
/* xs, sm, md, lg, xl */
.artwork-grid-col.artwork-xs {
  height: 30vw;
  width: 30vw;
}
.artwork-grid-col.artwork-sm {
  height: 30vw;
  width: 30vw;
}
.artwork-grid-col.artwork-md {
  height: 30vw;
  width: 30vw;
}
.artwork-grid-col.current-artwork.artwork-xs {
  left: 8vw;
  height: 85vw;
  width: 85vw;
}
.artwork-grid-col.current-artwork.artwork-sm {
  left: 10vw;
  height: 80vw;
  width: 80vw;
}
.artwork-grid-col.current-artwork.artwork-md {
  left: 20vw;
  height: 60vw;
  width: 60vw;
}
.artwork-grid-col:not(.current-artwork) {
  opacity: 0.5;
}

.artwork-grid-col.left-artwork {
  left: -40vw;
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
.artwork-grid-col.left-artwork.left-1.artwork-xs {
  left: -23vw;
}
.artwork-grid-col.left-artwork.left-2.artwork-xs,
.artwork-grid-col.left-artwork.left-3.artwork-xs {
  left: -40vw;
}
.artwork-grid-col.left-artwork.left-1.artwork-sm {
  left: -23vw;
}
.artwork-grid-col.left-artwork.left-2.artwork-sm,
.artwork-grid-col.left-artwork.left-3.artwork-sm {
  left: -40vw;
}
.artwork-grid-col.left-artwork.left-1.artwork-md {
  left: -11vw;
}
.artwork-grid-col.left-artwork.left-2.artwork-md,
.artwork-grid-col.left-artwork.left-3.artwork-md {
  left: -40vw;
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
.artwork-grid-col.right-artwork.right-1.artwork-xs {
  left: 94vw;
}
.artwork-grid-col.right-artwork.right-2.artwork-xs,
.artwork-grid-col.right-artwork.right-3.artwork-xs {
  left: 104vw;
}
.artwork-grid-col.right-artwork.right-1.artwork-sm {
  left: 94vw;
}
.artwork-grid-col.right-artwork.right-2.artwork-sm,
.artwork-grid-col.right-artwork.right-3.artwork-sm {
  left: 104vw;
}
.artwork-grid-col.right-artwork.right-1.artwork-md {
  left: 81vw;
}
.artwork-grid-col.right-artwork.right-2.artwork-md,
.artwork-grid-col.right-artwork.right-3.artwork-md {
  left: 104vw;
}
</style>
