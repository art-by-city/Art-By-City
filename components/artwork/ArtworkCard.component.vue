<template>
  <div class="artwork-card">
    <div v-if="artwork">
      <v-hover :disabled="disabled">
        <template v-slot:default="props">
          <v-img
            v-if="artwork"
            :src="src"
            style="cursor: pointer"
            aspect-ratio="1"
            class="elevation-2"
            @click="onArtworkCardClicked"
          >
            <v-fade-transition>
              <v-overlay v-if="!disabled && props.hover" absolute class="artwork-overlay">
                <v-row align="end" class="fill-height pa-1">
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
                    <LikeButton :dark="true" :artwork="artwork" />
                    <a class="artwork-card-title white--text text-lowercase">
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
import Artwork, {
  isImageFileRef,
  isImageUploadPreview
} from '~/models/artwork/artwork'

@Component({
  components: {
    LikeButton
  }
})
export default class ArtworkCard extends Vue {
  @Prop({
    default: null
  })
  artwork!: Artwork | null

  @Prop()
  disabled?: boolean

  @Prop({
    type: String,
    required: true
  }) readonly baseUrl!: string

  @Emit('click') onArtworkCardClicked() {
    return this.artwork
  }

  get src() {
    if (this.artwork) {
      const image = this.artwork.images[0]
      if (isImageFileRef(image)) {
        return `${this.baseUrl}/artwork-images/${image.source}`
      }

      if (isImageUploadPreview(image)) {
        return `data:${image.type};base64, ${image.ascii}`
      }
    }

    return ''
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
