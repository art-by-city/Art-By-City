<template>
  <div class="avatar-upload-input">
    <template v-if="cropMode && cropImage">
      <v-container>
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
      </v-container>
    </template>
    <template v-else>
      <div class="artwork-image-selector-container">
        <div v-if="value" class="artwork-image-selector">
          <v-hover v-slot:default="hoverProps">
            <v-avatar color="transparent" size="192">
              <v-img
                aspect-ratio="1"
                width="192"
                height="192"
                :src="value.dataUrl"
                class="clickable"
              >
                <v-overlay absolute :value="hoverProps.hover">
                  <v-file-input
                    class="artwork-upload-button"
                    accept="image/*"
                    hide-input
                    prepend-icon="mdi-camera"
                    @change="processAndSetImage"
                    :disabled="disabled"
                  ></v-file-input>
                  <div style="display: inline-flex;">
                    <v-btn
                      icon
                      small
                      :disabled="disabled"
                      @click="onCropArtworkImageClicked"
                    >
                      <v-icon>mdi-crop</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      small
                      :disabled="disabled"
                      @click="onDeleteArtworkImageClicked(i)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </v-overlay>
              </v-img>
            </v-avatar>
          </v-hover>
        </div>

        <div
          v-else
          class="artwork-image-selector"
          :class="{ 'has-error': this.hasImageValidationErrors }"
        >
          <v-responsive class="file-input-border">
            <v-file-input
              class="artwork-upload-button add-artwork-image-button"
              accept="image/*"
              hide-input
              prepend-icon="mdi-camera-plus"
              @change="processAndSetImage"
            ></v-file-input>
          </v-responsive>
          <span
            v-if="this.hasImageValidationErrors"
            class="red--text caption"
          >
            At least 1 image is required
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Model, Prop, Vue } from 'nuxt-property-decorator'
import Cropper from 'cropperjs'
import draggable from 'vuedraggable'

import { debounce, uuidv4, readFileAsDataUrlAsync } from '~/helpers'
import { ArtworkImage } from '~/types'

@Component({
  components: {
    draggable
  }
})
export default class AvatarUploadInput extends Vue {
  @Model('input', { type: Object }) value?: ArtworkImage | null
  cropImage?: ArtworkImage
  $refs!: {
    cropImage: HTMLImageElement
  }
  cropMode: boolean = false
  cropper?: Cropper
  hasImageValidationErrors: boolean = false

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly disabled!: boolean

  @debounce
  @Emit('change') onImageFileInputChanged(image: File): File {
    return image
  }

  @Emit('input') onAvatarChanged(avatar: ArtworkImage): ArtworkImage {
    return avatar
  }

  @debounce
  onSaveCropSelection() {
    if (this.cropper) {
      const type = 'image/png'
      this.onAvatarChanged({
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
  async processAndSetImage(image?: File) {
    if (image) {
      this.onAvatarChanged({
        guid: uuidv4(),
        dataUrl: await readFileAsDataUrlAsync(image),
        imageType: image.type
      })
    }
  }

  @debounce
  onCropArtworkImageClicked() {
    if (this.value) {
      this.cropMode = true
      this.cropImage = this.value

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
  }

  @debounce
  onDeleteArtworkImageClicked() {
    this.value = null
  }
}
</script>

<style scoped>
.avatar-upload-input {
  width: 192px;
  height: 192px;
  margin: 0 auto;
}

.artwork-image-selector-container {
  width: 100%;
}

.artwork-image-selector {
  height: 56px;
  width: 96px;
  margin: 5px;
}
.artwork-image-selector:nth-child(1) {
  min-height: 192px;
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
  border-radius: 50%;
}
</style>
