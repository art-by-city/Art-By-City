<template>
  <v-container class="artwork-edit-form">
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
    <v-form v-else
      ref="form"
      v-model="valid"
      autocomplete="off"
    >
      <v-row dense justify="center">
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
            <div
              v-if="!isAtMaxImages"
              class="artwork-image-selector"
              :class="{ 'has-error': this.hasImageValidationErrors }"
            >
              <v-responsive
                style="border: 1px dashed black; height: 100%;"
              >
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
      </v-row>
      <v-row dense justify="center">
        <v-col cols="12">
          <v-text-field
            v-model="artwork.title"
            type="text"
            name="artworkTitle"
            label="Title"
            :rules="titleRules"
          ></v-text-field>
          <v-text-field
            v-model="artwork.slug"
            type="text"
            name="artworkSlug"
            :label="slugBase"
            :rules="slugRules"
          ></v-text-field>
          <!-- <ArtworkTypeSelector
            v-model="artwork.type"
            :artworkTypes="$store.state.config.artworkTypes"
            required
          /> -->
          <!-- <CitySelector
            v-model="artwork.city"
            :cities="$store.state.config.cities"
            disabled
          /> -->
          <!-- <HashtagSelector
            v-model="artwork.hashtags"
            :hashtags="$store.state.config.hashtags"
          /> -->
          <v-textarea
            v-model="artwork.description"
            name="artworkDescription"
            label="Description"
            hint="Enter a description for this Artwork"
            auto-grow
            rows="2"
            :rules="descriptionRules"
          ></v-textarea>
          <LicenseSelector v-model="artwork.license" />
        </v-col>
      </v-row>
      <v-row dense justify="center" v-if="transaction">
        <TransactionFormControls
          :transaction="transaction"
          :loading="isUploading"
          @cancel="onCancel"
          @submit="onSubmit"
        />
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'nuxt-property-decorator'
import draggable from 'vuedraggable'
import Cropper from 'cropperjs'
import Transaction from 'arweave/node/lib/transaction'

import { Artwork, ArtworkImage } from '~/types'
import { debounce, uuidv4 } from '~/helpers'
import ProgressService from '~/services/progress/service'
import CitySelector from '~/components/forms/citySelector.component.vue'
import ArtworkTypeSelector from '~/components/forms/artworkTypeSelector.component.vue'
import LicenseSelector from '~/components/forms/licenseSelector.component.vue'
import HashtagSelector from '~/components/forms/hashtagSelector.component.vue'
import TransactionFormControls from '~/components/forms/transactionFormControls.component.vue'

@Component({
  components: {
    CitySelector,
    ArtworkTypeSelector,
    HashtagSelector,
    draggable,
    LicenseSelector,
    TransactionFormControls
  }
})
export default class ArtworkEditForm extends Vue {
  @Prop({ type: Object, required: true }) artwork!: Artwork
  @Watch('artwork', {
    deep: true,
    immediate: true
  }) async onArtworkChanged(artwork: Artwork) {
    this.transaction = await this.$artworkService.createArtworkTransaction(
      artwork
    )
  }
  transaction: Transaction | null = null
  $refs!: {
    cropImage: HTMLImageElement,
    form: Vue & {
      validate: () => boolean
      resetValidation: () => void
    }
  }
  cropMode: boolean = false
  cropImage?: ArtworkImage
  cropImageIndex?: number
  cropper?: Cropper
  valid = false
  dirty = false
  isUploading: boolean = false

  @Emit('previewImageChanged') onPreviewImageChanged() {}
  @Emit('save') _save(txId: string) {
    return txId
  }
  @Emit('cancel') onCancel() {}

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
    const username = this.artwork.creator.address

    return `artby.city/${username}/`
  }

  get hasImageValidationErrors(): boolean {
    return this.dirty && this.artwork.images.length < 1
  }

  @debounce
  async onArtworkImageChanged(index: number, image: File | undefined) {
    if (image) {
      await this.processAndSetArtworkImage(image, index)
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
  async onAddArtworkImageClicked(image: File | undefined) {
    if (image) {
      await this.processAndSetArtworkImage(image)
    }
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
      const type = 'image/png'
      this.artwork.images.splice(this.cropImageIndex, 1, {
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

  async onSubmit(transaction: Transaction) {
    this.dirty = true
    this.valid = this.$refs.form.validate()

    if (this.hasImageValidationErrors) {
      this.valid = false
    }

    if (this.valid) {
      this.isUploading = true

      await this.$arweave.transactions.sign(transaction)

      this.$accessor.transactions.queueTransaction({
        type: 'artwork',
        transaction
      })

      this.isUploading = false

      return this._save(transaction.id)
    }
  }

  private async processArtworkImage(image: File): Promise<ArtworkImage> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = async (error) => {
        reject(error)
      }
      reader.onload = async (evt) => {
        if (!evt.target) {
          reject('Error reading file')
          return
        }

        resolve({
          guid: uuidv4(),
          dataUrl: reader.result?.toString() || '',
          imageType: image.type
        })
      }
      reader.readAsDataURL(image)
    })
  }

  private async processAndSetArtworkImage(image: File, index?: number) {
    const processedImage = await this.processArtworkImage(image)

    if (typeof index === 'undefined') {
      index = this.artwork.images.length
      this.artwork.images.push(processedImage)
    } else {
      this.artwork.images[index] = processedImage
    }

    if (index === 0) {
      await this.suggestMetadataFromFile(image)
      this.onPreviewImageChanged()
    }
  }

  private async suggestMetadataFromFile(image: File) {
    // Suggested title is filename without extension
    this.artwork.title = image.name.slice(0, image.name.lastIndexOf('.'))
    this.artwork.slug = this.artwork.title
      .toLowerCase()
      .replace(/[^a-z0-9_\-]/g, '')
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
.artwork-image-selector.has-error {
  border: 1px solid red;
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
