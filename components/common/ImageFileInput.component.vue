<template>
  <div class="image-file-input">
    <template v-if="cropMode && cropImage">
      <v-row dense>
        <img
          id="cropImage"
          class="crop-image"
          :src="cropImage.dataUrl"
        />
      </v-row>
      <v-row dense>
        <v-col>
          <v-btn small icon @click="onSaveCropSelection">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
          <v-btn small icon @click="onCancelCropSelection">
            <v-icon>mdi-cancel</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <div class="artwork-image-selector-container">
        <draggable
          style="height:100%; width:100%; display: flex; flex-wrap: wrap;"
          :list="value"
          handle=".drag-handle"
          @sort="onPreviewImageChanged()"
        >
          <div
            class="artwork-image-selector"
            v-for="(image, i) in value"
            :key="image.guid"
          >
            <v-hover v-slot:default="hoverProps">
              <v-img
                aspect-ratio="1.7"
                max-height="300px"
                contain
                :src="image.dataUrl"
                class="clickable"
              >
                <v-overlay absolute :value="hoverProps.hover">
                  <v-file-input
                    class="artwork-upload-button"
                    accept="image/*"
                    hide-input
                    prepend-icon="mdi-camera"
                    @change="onArtworkImageChanged(i, $event)"
                  ></v-file-input>
                  <div style="display: inline-flex;">
                    <v-btn
                      icon
                      small
                      @click="onCropArtworkImageClicked(i)"
                    >
                      <v-icon>mdi-crop</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      small
                      @click="onDeleteArtworkImageClicked(i)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-btn
                      v-if="max > 1"
                      icon
                      small
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
            v-if="!isAtMaxImages"
            class="artwork-image-selector"
            :class="{ 'has-error': this.hasImageValidationErrors }"
          >
            <v-responsive style="border: 1px dashed black; height: 100%;">
              <v-file-input
                class="artwork-upload-button add-artwork-image-button"
                accept="image/*"
                hide-input
                prepend-icon="mdi-camera-plus"
                @change="onAddArtworkImageClicked"
              ></v-file-input>
            </v-responsive>
            <span
              v-if="this.hasImageValidationErrors"
              class="red--text caption"
            >
              At least 1 image is required
            </span>
          </div>
        </draggable>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Emit, Model } from 'nuxt-property-decorator'
import Cropper from 'cropperjs'
import draggable from 'vuedraggable'

import { debounce, uuidv4, readFileAsDataUrlAsync } from '~/helpers'
import { ArtworkImage } from '~/types'

@Component({
  components: {
    draggable
  }
})
export default class ImageFileInput extends Vue {
  $refs!: {
    cropImage: HTMLImageElement
  }
  cropMode: boolean = false
  cropImage?: ArtworkImage
  cropImageIndex?: number
  cropper?: Cropper

  @Model('input', { type: Array, required: true }) value!: ArtworkImage[]

  hasImageValidationErrors: boolean = false

  // TODO -> configurable property
  max: number = 1

  @debounce
  @Emit('change') onImageFileInputChanged(image: File): File {
    return image
  }

  @Emit('previewImageChanged') onPreviewImageChanged() {}

  get isAtMaxImages(): boolean {
    return this.max === this.value.length
  }

  @debounce
  onSaveCropSelection() {
    if (this.cropper && typeof this.cropImageIndex !== 'undefined') {
      const type = 'image/png'
      this.value.splice(this.cropImageIndex, 1, {
        guid: uuidv4(),
        imageType: type,
        dataUrl: this.cropper
          .getCroppedCanvas()
          .toDataURL(type)
      })

      this.cropMode = false
      this.cropper.destroy()
    }
  }

  @debounce
  onCancelCropSelection() {
    this.cropMode = false
    this.cropper?.destroy()
  }

  @debounce
  async onArtworkImageChanged(index: number, image: File | undefined) {
    if (image) {
      await this.processAndSetImage(image, index)
    }
  }

  @debounce
  async onAddArtworkImageClicked(image: File | undefined) {
    if (image) {
      await this.processAndSetImage(image)
    }
  }

  private async processAndSetImage(image: File, index?: number) {
    const processedImage = {
      guid: uuidv4(),
      dataUrl: await readFileAsDataUrlAsync(image),
      imageType: image.type
    }

    if (typeof index === 'undefined') {
      index = this.value.length
      this.value.push(processedImage)
    } else {
      Vue.set(this.value, index, processedImage)
    }

    if (index === 0) {
      // TODO -> suggest metadata hook somehow, pass image
      this.onPreviewImageChanged()
    }
  }

  @debounce
  onCropArtworkImageClicked(index: number) {
    this.cropMode = true
    this.cropImageIndex = index
    this.cropImage = this.value[index]

    if (this.cropper) {
      this.cropper.destroy()
    }

    this.$nextTick(() => {
      this.cropper = new Cropper(
        document.getElementById('cropImage') as HTMLImageElement,
        {
          viewMode: 1
        }
      )
    })
  }

  @debounce
  onDeleteArtworkImageClicked(index: number) {
    this.value.splice(index, 1)

    if (index === 0) {
      this.onPreviewImageChanged()
    }
  }
}
</script>

<style scoped>
.artwork-image-selector-container {
  width: 100%;
}

.artwork-image-selector {
  height: 56px;
  width: 96px;
  margin: 5px;
}
.artwork-image-selector:nth-child(1) {
  min-height: 256px;
  width: 100%;
  margin-bottom: 25px;
  flex-basis: fill;
}
.artwork-image-selector.has-error {
  border: 1px solid red;
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
  margin: 0px;
}

.add-artwork-image-button {
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.crop-image {
  display: block;
  max-width: 100%;
}

.file-input-border {
  border: 1px dashed black;
  height: 100%;
}
</style>
