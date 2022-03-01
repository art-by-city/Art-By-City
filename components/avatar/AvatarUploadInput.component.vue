<template>
  <div class="avatar-upload-input">
    <v-card elevation="0" v-show="cropMode" height="222px">
      <v-card-text class="pa-0 mx-auto">
        <img
          id="cropImage"
          class="crop-image"
          :src="cropImage"
        />
      </v-card-text>
      <v-card-actions v-if="cropMode" class="crop-actions mx-auto py-0">
        <v-btn small icon @click="onCancelCropSelection">
          <v-icon>mdi-cancel</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn small icon @click="onSaveCropSelection">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <div v-if="!cropMode" class="artwork-image-selector-container">
      <div v-if="value" class="artwork-image-selector mx-auto">
        <v-hover v-slot:default="hoverProps">
          <v-avatar color="transparent" size="192">
            <v-img
              aspect-ratio="1"
              width="192"
              height="192"
              :src="value.url"
              class="clickable"
            >
              <v-overlay absolute :value="hoverProps.hover">
                <v-file-input
                  class="artwork-upload-button"
                  accept="image/jpeg,image/png,image/gif"
                  hide-input
                  prepend-icon="mdi-camera"
                  @change="processAndSetImage"
                  :disabled="disabled"
                ></v-file-input>
                <div style="display: inline-flex;">
                  <v-btn
                    icon
                    small
                    :disabled="disabled || value.imageType === 'image/gif'"
                    @click="onCropArtworkImageClicked"
                  >
                    <v-icon>mdi-crop</v-icon>
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Model, Prop, Vue } from 'nuxt-property-decorator'
import Cropper from 'cropperjs'

import { debounce, uuidv4 } from '~/helpers'
import { URLArtworkImage } from '~/types'

@Component
export default class AvatarUploadInput extends Vue {
  $refs!: {
    cropImage: HTMLImageElement
  }
  cropImage: string = ''
  cropMode: boolean = false
  cropper?: Cropper

  @Model('input', { type: Object }) value?: URLArtworkImage | null

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly disabled!: boolean

  @Emit('input') async onAvatarChanged(url: string, type: string):
    Promise<URLArtworkImage | void> {
    if (this.value && this.cropper) {
      this.onDirty()
      const guid = uuidv4()

      if (type === 'image/gif') {
        return {
          guid, imageType: type, url
        }
      }

      return await new Promise<URLArtworkImage>((resolve) => {
        this.cropper?.getCroppedCanvas({
          width: 400,
          height: 400
        }).toBlob((blob) => {
          if (blob) {
            URL.revokeObjectURL(url)
            resolve({
              guid,
              imageType: type,
              url: URL.createObjectURL(blob)
            })
          }
        }, type)
      })
    }
  }

  @Emit('cropmode') onCropMode(enabled: boolean) {
    return enabled
  }

  @Emit('dirty') onDirty() {}

  mounted() {
    if (this.value) {
      this.refreshCropper(this.value?.url)
    }
  }

  unmounted() {
    if (this.value) {
      URL.revokeObjectURL(this.value?.url)
    }
    if (this.cropper) {
      this.cropper.destroy()
    }
  }

  @debounce
  async processAndSetImage(image?: File) {
    if (image) {
      if (image.type === 'image/gif' && image.size > 5000000) {
        this.$toastService.error('Animated avatars must be less than 5 MB.')
      } else {
        const url = URL.createObjectURL(image)
        this.refreshCropper(url, () => {
          this.onAvatarChanged(url, image.type)
        })
      }
    }
  }

  private refreshCropper(url: string, cb?: Function) {
    this.cropImage = url

    if (this.cropper) {
      this.cropper.destroy()
    }

    this.$nextTick(() => {
      this.cropper = new Cropper(
        document.getElementById('cropImage') as HTMLImageElement,
        {
          viewMode: 1,
          aspectRatio: 1,
          minContainerHeight: 192,
          minContainerWidth: 192,
          ready() {
            if (cb) {
              cb()
            }
          }
        }
      )
    })
  }

  private toggleCropMode(enabled: boolean) {
    this.cropMode = enabled
    this.onCropMode(enabled)
  }

  @debounce
  onCropArtworkImageClicked() {
    if (this.value) {
      this.toggleCropMode(true)
    }
  }

  @debounce
  onSaveCropSelection() {
    if (this.cropper && this.value) {
      this.onAvatarChanged(this.value.url, this.value.imageType)
      this.toggleCropMode(false)
    }
  }

  @debounce
  onCancelCropSelection() {
    this.toggleCropMode(false)
  }
}
</script>

<style scoped>
.avatar-upload-input {
  width: 300px;
  /* height: 192px; */
  margin: 0 auto;
}

.avatar-upload-input >>> .cropper-container.cropper-bg {
  background-repeat: repeat;
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
  width: 192px;
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

.crop-actions {
  width: 150px;
}
</style>
