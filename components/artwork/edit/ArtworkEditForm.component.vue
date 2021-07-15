<template>
  <v-container class="artwork-edit-form">
    <v-row v-if="cropMode && cropImage" dense>
      <img
        id="cropImage"
        class="crop-image"
        :src="getImageSource(cropImage, baseUrl)"
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
          @sort="onPreviewImageChanged()"
        >
          <div
            class="artwork-image-selector"
            v-for="(image, i) in artwork.images"
            :key="i"
          >
            <v-hover v-slot:default="hoverProps">
              <v-img
                aspect-ratio="1.7"
                max-height="300px"
                contain
                :src="getImageSource(image, baseUrl)"
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
              style="border: 1px dashed black; height: 100%;"
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
    <v-row v-if="!cropMode" dense justify="center">
      <v-col cols="12">
        <v-text-field
          v-model="artwork.title"
          type="text"
          name="artworkTitle"
          label="Title"
          class="text-lowercase"
          :rules="titleRules"
        ></v-text-field>
        <v-text-field
          v-model="artwork.slug"
          type="text"
          name="artworkSlug"
          :label="slugBase"
          class="text-lowercase"
          :rules="slugRules"
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
          rows="2"
          class="text-lowercase"
          :rules="descriptionRules"
        ></v-textarea>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn text color="error" class="text-lowercase" @click="cancel">
          Cancel
        </v-btn>
        <v-btn text color="success" class="text-lowercase" @click="save">
          Save
        </v-btn>
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

  @Emit('previewImageChanged') onPreviewImageChanged() {}
  @Emit('save') save() {}
  @Emit('cancel') cancel() {}

  @Prop({
    type: String,
    required: true
  }) readonly baseUrl!: string

  @Prop({
    type: String,
    required: false
  }) readonly owner!: string

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

  get slugRules() {
    return [(value: string = '') => {
      if (value.length < 1) {
        return 'URL slug is required'
      }

      if (value.length > 128) {
        return 'URL slug must be no more than 128 characters'
      }

      const validSlugRegex = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/

      if (!validSlugRegex.test(value)) {
        return 'URL slug must be a valid slug (lowerchase alphanumerics, hyphen, underscore)'
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

  get slugBase(): string {
    return `artby.city/${this.artwork.owner.username}/`
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

    if (index === 0) {
      this.onPreviewImageChanged()
    }
  }

  @debounce
  async onDeleteArtworkImageClicked(index: number) {
    this.artwork.images.splice(index, 1)

    if (index === 0) {
      this.onPreviewImageChanged()
    }
  }

  @debounce
  async onAddArtworkImageClicked(image: File) {
    // NG: There seems to be an issue with the v-file-input component where it
    //     will sometimes trigger this function with undefined input if the
    //     user cancels the filesystem dialog
    if (image) {
      this.artwork.images.splice(
        this.artwork.images.length,
        0,
        await this.createImagePreview(image)
      )

      if (this.artwork.images.length === 1) {
        await this.suggestMetadataFromFile(image)
        this.onPreviewImageChanged()
      }
    }
  }

  private async suggestMetadataFromFile(image: File) {
    // Suggested title is filename without extension
    this.artwork.title = image.name.slice(0, image.name.lastIndexOf('.'))
    this.artwork.slug = this.artwork.title
      .toLowerCase()
      .replace(/[^a-z0-9_\-]/g, '')
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
  padding: 12px 48px;
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
  margin: 5px;
}
.artwork-image-selector:nth-child(1) {
  height: 300px;
  width: 100%;
  margin-bottom: 25px;
  flex-basis: fill;
}
.break {
  flex-basis: 100%;
  height: 0;
}
.crop-image {
  display: block;
  max-width: 100%;
}
</style>
