<template>
  <div class="artwork-card">
    <v-hover :disabled="disabled">
      <template v-slot:default="props">
        <v-img
          :src="src"
          style="cursor: pointer"
          aspect-ratio="1"
          class="elevation-2"
          @click="onArtworkCardClicked"
        >
          <template v-slot:placeholder>
            <TransactionPlaceholder :txId="txId" />
          </template>

          <v-fade-transition>
            <v-overlay
              v-if="!disabled && props.hover"
              absolute
              class="artwork-overlay"
            >
              <v-row align="end" class="fill-height pa-1 pl-4">
                <v-col
                  cols="auto"
                  class="
                    artwork-overlay-title-container
                    disable-text-highlighting
                  "
                >
                  <div
                    v-if="disabled"
                    class="artwork-card-disable-overlay"
                  ></div>
                  <!-- <LikeButton :dark="true" :artwork="artwork" /> -->
                  <a class="artwork-card-title white--text">
                    {{ artwork ? artwork.title : '' }}
                  </a>
                  <br />
                  <a
                    class="
                      artwork-card-title
                      white--text
                      font-italic
                      font-weight-thin
                    "
                  >
                    {{ artwork ? artwork.creator.address : '' }}
                  </a>
                </v-col>
              </v-row>
            </v-overlay>
          </v-fade-transition>
        </v-img>
      </template>
    </v-hover>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'

import LikeButton from '../likeButton.component.vue'
import { Artwork } from '~/types'
import { debounce } from '~/helpers'

@Component({
  components: {
    LikeButton
  }
})
export default class ArtworkCard extends Vue {
  @Prop({
    required: true
  })
  txId!: string

  @Prop()
  disabled?: boolean

  @debounce
  @Emit('click') onArtworkCardClicked() {
    if (this.artwork) {
      if (this.artwork.slug) {
        this.$router.push(
          `/${this.artwork.creator.address}/${this.artwork.slug}`
        )
      } else {
        this.$router.push(`/${this.artwork.creator.address}/${this.artwork.id}`)
      }
    }
  }

  artwork: Artwork | null = null

  get src() {
    if (this.artwork && this.artwork.images.length > 0) {
      return this.artwork.images[0].dataUrl
    }

    return ''
  }

  fetchOnServer = false
  async fetch() {
    this.artwork = await this.$artworkService.fetch(this.txId)
  }
}
</script>

<style scoped>
.artwork-overlay >>> div.v-overlay__content {
  height: 100%;
  width: 100%;
}
.artwork-overlay div.artwork-container {
  height: 100%;
}
.artwork-overlay-title-container {
  padding-bottom: 2px;
}
.artwork-card-disable-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 8990;
}
</style>
