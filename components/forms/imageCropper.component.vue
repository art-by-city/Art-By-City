<template>
  <v-container class="image-cropper">
    <v-row dense>
      <img
        id="cropImage"
        class="crop-image"
        :src="image.url"
      />
    </v-row>
    <v-row dense>
      <v-col>
        <v-btn small icon @click="onSave">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn small icon @click="onCancel">
          <v-icon>mdi-cancel</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'nuxt-property-decorator'
import Cropper from 'cropperjs'

import { URLArtworkImage } from '~/app/core'
import { debounce } from '~/app/util'

@Component
export default class ImageCropper extends Vue {
  cropper?: Cropper

  @Prop({
    type: Object,
    required: true
  }) image!: URLArtworkImage

  @Watch('image', { immediate: true }) async onImageChanged() {
    this.cropper?.destroy()
    await new Promise<void>(resolve => {
      this.$nextTick(() => {
        this.cropper = new Cropper(
          document.getElementById('cropImage') as HTMLImageElement,
          {
            viewMode: 1,
            ready() { resolve() }
          }
        )
      })
    })
  }

  @debounce
  @Emit('cancel') onCancel() {
    this.cropper?.destroy()
  }

  @debounce
  @Emit('save') async onSave() {
    if (this.cropper) {
      return new Promise<URLArtworkImage>((resolve) => {
        this.cropper?.getCroppedCanvas().toBlob(blob => {
          if (blob) {
            resolve({
              type: 'image/png',
              url: URL.createObjectURL(blob)
            })
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.crop-image {
  display: block;
  max-width: 100%;
}
</style>
