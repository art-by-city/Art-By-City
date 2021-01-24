<template>
  <v-container class="artwork-edit-form">
    <v-row v-if="cropMode && cropImage" dense>
      <img
        id="cropImage"
        class="crop-image"
        :src="getImageSource(cropImage)"
      />
    </v-row>
    <v-row v-if="cropMode && cropImage" dense>
      <v-col>
        <v-btn small icon @click="onSaveCropSelection">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn small icon @click="onCancelCropSelection">
          <v-icon>mdi-cancel</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="!cropMode" dense justify="center">
      <div class="artwork-image-selector-container">
        <draggable
          style="height:100%; width:100%; display: flex; flex-wrap: wrap;"
          :list="artwork.images"
          handle=".drag-handle"
        >
          <div
            class="artwork-image-selector"
            v-for="(image, i) in artwork.images"
            :key="i"
          >
            <v-hover v-slot:default="hoverProps">
              <v-img
                aspect-ratio="1.7"
                :src="getImageSource(image)"
                class="clickable"
              >
                <v-overlay absolute :value="hoverProps.hover">
                  <v-file-input
                    class="artwork-upload-button"
                    accept="image/png, image/jpeg"
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
          <div class="artwork-image-selector" v-if="!isAtMaxImages">
            <v-responsive
              aspect-ratio="1.7"
              style="border: 1px dashed black;"
            >
              <v-file-input
                class="artwork-upload-button add-artwork-image-button"
                accept="image/png, image/jpeg"
                hide-input
                prepend-icon="mdi-camera-plus"
                @change="onAddArtworkImageClicked"
              ></v-file-input>
            </v-responsive>
          </div>
        </draggable>
      </div>
    </v-row>
    <v-row v-if="!cropMode" dense>
      <v-col>
        <v-text-field
          v-model="artwork.title"
          type="text"
          name="artworkTitle"
          label="Title"
          class="text-lowercase"
          :rules="titleRules"
        ></v-text-field>
        <ArtworkTypeSelector
          v-model="artwork.type"
          :artworkTypes="$store.state.config.artworkTypes"
          required
        />
        <CitySelector
          v-model="artwork.city"
          :cities="$store.state.config.cities"
          disabled
        />
        <HashtagSelector
          v-model="artwork.hashtags"
          :hashtags="$store.state.config.hashtags"
        />
        <v-textarea
          v-model="artwork.description"
          name="artworkDescription"
          label="Description"
          hint="Enter a description for this Artwork"
          auto-grow
          rows="1"
          class="text-lowercase"
          :rules="descriptionRules"
        ></v-textarea>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'
import draggable from 'vuedraggable'
import Cropper from 'cropperjs'

import Artwork, {
  getImageSource,
  ImageUploadPreview,
  ArtworkImageFile,
  isImageFileRef
} from '~/models/artwork/artwork'
import CitySelector from '~/components/forms/citySelector.component.vue'
import ArtworkTypeSelector from '~/components/forms/artworkTypeSelector.component.vue'
import HashtagSelector from '~/components/forms/hashtagSelector.component.vue'
import { readFileAsDataUrlAsync, debounce } from '~/helpers/helpers'

@Component({
  components: {
    CitySelector,
    ArtworkTypeSelector,
    HashtagSelector,
    draggable
  }
})
export default class ArtworkEditForm extends Vue {
  @Prop({ type: Object, required: true }) artwork!: Artwork

  getImageSource = getImageSource

  $refs!: {
    cropImage: HTMLImageElement
  }
  cropMode: boolean = false
  cropImage?: ArtworkImageFile
  cropImageIndex?: number
  cropper?: Cropper

  get titleRules() {
    return [(value: string = '') => {
      if (value.length < 1) {
        return 'title is required'
      }

      if (value.length > 128) {
        return 'title must be no more than 128 characters'
      }

      return true
    }]
  }

  get descriptionRules() {
    return [(value: string = '') => {
      if (value.length > 1024) {
        return 'description must be no more than 1024 characters'
      }

      return true
    }]
  }

  get isAtMaxImages(): Boolean {
    if (this.artwork.images.length >= 12) {
      return true
    }

    return false
  }

  private async createImagePreview(image: File): Promise<ImageUploadPreview> {
    const imgData = await readFileAsDataUrlAsync(image)
    return {
      ascii: imgData.split(',')[1],
      type: image.type
    } as ImageUploadPreview
  }

  @debounce
  async onArtworkImageChanged(index: number, image: File) {
    this.artwork.images.splice(
      index,
      1,
      await this.createImagePreview(image)
    )
  }

  @debounce
  async onDeleteArtworkImageClicked(index: number) {
    this.artwork.images.splice(index, 1)
  }

  @debounce
  async onAddArtworkImageClicked(image: File) {
    this.artwork.images.splice(
      this.artwork.images.length,
      0,
      await this.createImagePreview(image)
    )
  }

  @debounce
  onCropArtworkImageClicked(index: number) {
    this.cropMode = true
    this.cropImageIndex = index
    this.cropImage = this.artwork.images[index]
    if (this.cropper) {
      this.cropper.destroy()
    }
    this.$nextTick(() => {
      this.cropper = new Cropper(document.getElementById('cropImage') as HTMLImageElement, {
        viewMode: 1
      })
    })
  }

  @debounce
  onSaveCropSelection() {
    if (this.cropper && typeof this.cropImageIndex !== 'undefined') {
      let type = 'image/png'
      const originalImage = this.artwork.images[this.cropImageIndex]
      if (!isImageFileRef(originalImage)) {
        type = originalImage.type
      }
      this.artwork.images.splice(this.cropImageIndex, 1, {
        type,
        ascii: this.cropper
          .getCroppedCanvas()
          .toDataURL(type)
          .replace(/^data:image\/(png|jpg);base64,/, '')
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
}
</script>

<style scoped>
.artwork-edit-form {
  background-color: white;
  padding: 12px 120px;
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
.artwork-image-selector {
  height: 56px;
  width: 96px;
  margin: 5px;
}
.crop-image {
  display: block;
  max-width: 100%;
}
</style>
