<template>
  <div class="artwork-card">
    <div v-if="artwork">
      <v-hover>
        <template v-slot:default="props">
          <v-img
            v-if="artwork"
            :src="getImageSource(artwork.images[0])"
            style="cursor: pointer"
            aspect-ratio="1"
            class="elevation-2"
            @click="onArtworkCardClicked"
          >
            <v-fade-transition>
              <v-overlay v-if="props.hover" absolute class="artwork-overlay">
                <v-row align="end" class="fill-height pa-1">
                  <v-col cols="auto" class="artwork-overlay-title-container">
                    <!-- <LikeButton :dark="true" :artwork="artwork" /> -->
                    <a class="white--text text-lowercase">
                      {{ artwork.title }}
                    </a>
                  </v-col>
                </v-row>
              </v-overlay>
            </v-fade-transition>
          </v-img>
        </template>
      </v-hover>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'

import LikeButton from '../likeButton.component.vue'
import { getImageSource } from '~/models/artwork/artwork'

@Component({
  components: {
    LikeButton
  }
})
export default class ArtworkCard extends Vue {
  @Prop({
    default: null
  })
  artwork: any | null

  getImageSource = getImageSource

  @Emit('click') onArtworkCardClicked() {
    return this.artwork
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
</style>
