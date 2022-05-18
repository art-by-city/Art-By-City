<template>
  <div class="image-input">
    <template v-if="cropMode && cropImage">
      <ImageCropper
        :image="cropImage"
        @cancel="onCancelCropSelection"
        @save="onSaveCropSelection"
      />
    </template>
    <div v-else class="artwork-image-selector-container">
      <draggable
        style="height:100%; width:100%; display: flex; flex-wrap: wrap;"
        :list="draggableImages"
        handle=".drag-handle"
      >
        <div
          class="artwork-image-selector"
          v-for="(image, i) in draggableImages"
          :key="image.guid"
        >
          <v-hover v-slot:default="hoverProps">
            <v-img
              aspect-ratio="1.7"
              max-height="300px"
              contain
              :src="image.url"
              class="clickable"
            >
              <v-overlay absolute :value="hoverProps.hover">
                <label
                  class="artwork-upload-label"
                  for="upload"
                >
                  <v-icon>mdi-camera-plus</v-icon>
                </label>
                <input
                  id="upload"
                  class="artwork-upload-input"
                  type="file"
                  :accept="accept"
                  @input="onImageChanged($event, i)"
                />
                <div style="display: inline-flex;">
                  <v-btn
                    icon
                    small
                    :disabled="disabled"
                    @click="onCropImageClicked(i)"
                  >
                    <v-icon>mdi-crop</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    small
                    :disabled="disabled"
                    @click="onDeleteImageClicked(i)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    small
                    :disabled="disabled"
                    class="drag-handle"
                  >
                    <v-icon>mdi-drag-variant</v-icon>
                  </v-btn>
                </div>
              </v-overlay>
            </v-img>
          </v-hover>
        </div>
        <div
          v-if="draggableImages.length < max"
          class="artwork-image-selector"
          :class="{ 'has-error': !valid }"
        >
          <v-responsive
            style="border: 1px dashed black; height: 100%;"
          >
            <v-file-input
              class="artwork-upload-button add-artwork-image-button"
              :accept="accept"
              hide-input
              prepend-icon="mdi-camera-plus"
              @change="onAddImageClicked($event)"
            ></v-file-input>
          </v-responsive>
          <span
            v-if="!valid"
            class="red--text caption"
          >
            An image is required
          </span>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Model, Prop, Vue } from 'nuxt-property-decorator'
import draggable from 'vuedraggable'
import _ from 'lodash'

import { TrackableEntity, URLArtworkImage } from '~/app/core'
import { debounce, uuidv4 } from '~/app/util'
import ImageCropper from './imageCropper.component.vue'

type OneOrMoreImages =
  | (TrackableEntity & URLArtworkImage)
  | (TrackableEntity & URLArtworkImage)[]

@Component({
  components: {
    draggable,
    ImageCropper
  }
})
export default class ImageInput extends Vue {
  readonly accept = 'image/apng,image/avif,image/gif,image/jpeg,image/png,'
                  + 'image/svg+xml,image/webp'

  cropMode: boolean = false
  cropImage?: URLArtworkImage
  cropImageIndex?: number

  @Model('input', {
    type: [Object, Array],
    required: true
  }) images!: OneOrMoreImages
  @Emit('input') onImagesChanged(images: OneOrMoreImages): OneOrMoreImages {
    return images
  }

  @Emit('primary') onPrimaryImageChanged(image: File) {
    return image
  }

  @Prop({
    type: Boolean,
    required: false,
    default: true
  }) readonly valid!: boolean

  @Prop({
    type: Boolean,
    required: false,
    default: true
  }) readonly disabled!: boolean

  @Prop({
    type: Number,
    required: false,
    default: 1
  }) readonly max!: number

  get draggableImages(): (TrackableEntity & URLArtworkImage)[] {
    if (_.isArray(this.images)) {
      return this.images
    } else {
      return this.images.url
        ? [this.images]
        : []
    }
  }

  @debounce
  async onImageChanged(event: InputEvent, index: number) {
    if (event.target) {
      const target = event.target as HTMLInputElement
      if (target.files && target.files[0]) {
        await this.processAndSetImage(target.files[0], index)
      }
    }
  }

  @debounce
  async onDeleteImageClicked(index: number) {
    if (_.isArray(this.images)) {
      const copy = this.images.slice()
      copy.splice(index, 1)
      this.onImagesChanged(copy)
    } else {
      this.onImagesChanged([])
    }
  }

  @debounce
  async onAddImageClicked(image: File | undefined) {
    if (image) {
      await this.processAndSetImage(image)
    }
  }

  @debounce
  async onCropImageClicked(index: number) {
    this.cropMode = true
    this.cropImageIndex = index
    this.cropImage = _.isArray(this.images)
      ? this.images[index]
      : this.images
  }

  @debounce
  onSaveCropSelection(image: URLArtworkImage) {
    this.cropMode = false
    const trackable = {
      guid: uuidv4(),
      ...image
    }
    if (_.isArray(this.images)) {
      if (typeof this.cropImageIndex !== 'undefined') {
        const copy = this.images.slice()
        copy.splice(this.cropImageIndex, 1, trackable)
        this.onImagesChanged(copy)
      }
    } else {
      this.onImagesChanged(trackable)
    }
  }

  @debounce
  onCancelCropSelection() {
    this.cropMode = false
  }

  private async processAndSetImage(image: File, index?: number) {
    const urlImage = {
      guid: uuidv4(),
      type: image.type,
      url: URL.createObjectURL(image)
    }

    if (_.isArray(this.images)) {
      if (typeof index === 'undefined') {
        index = this.images.length
        this.onImagesChanged([...this.images, urlImage])
      } else {
        const copy = this.images.slice()
        copy[index] = urlImage
        this.onImagesChanged(copy)
      }
    } else {
      index = 0
      this.onImagesChanged(urlImage)
    }

    if (index === 0) {
      this.onPrimaryImageChanged(image)
    }
  }
}
</script>

<style scoped>
.image-input {
  width: 100%;
}
.artwork-upload-button.v-text-field {
  margin-top: 0px;
  display: inline-flex;
  align-items: center;
  padding: 2px;
}
.artwork-upload-button >>> .v-input__control {
  display: none;
}
.artwork-upload-button >>> .v-input__prepend-outer {
  margin-right: 0px;
  margin-left: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
}
.add-artwork-image-button {
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.artwork-image-selector-container {
  width: 100%;
}
.artwork-image-selector {
  height: 56px;
  width: 96px;
}
.artwork-image-selector.has-error {
  border: 1px solid red;
}
.artwork-image-selector:nth-child(1) {
  height: 300px;
  width: 100%;
  margin-bottom: 25px;
  flex-basis: fill;
}
.artwork-upload-label {
  cursor: pointer;
  height: 28px;
  width: 28px;
  display: inline-flex;
}
.artwork-upload-input {
  display: none;
}
</style>
