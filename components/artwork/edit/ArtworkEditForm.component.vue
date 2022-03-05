<template>
  <v-container class="artwork-edit-form">
    <template v-if="cropMode && cropImage">
      <v-row dense>
        <img
          id="cropImage"
          class="crop-image"
          :src="cropImage.url"
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
      :disabled="isUploading || isSigned"
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
                  :src="image.url"
                  class="clickable"
                >
                  <v-overlay absolute :value="hoverProps.hover">
                    <v-file-input
                      class="artwork-upload-button"
                      :accept="accept"
                      hide-input
                      prepend-icon="mdi-camera"
                      @change="onArtworkImageChanged(i, $event)"
                    ></v-file-input>
                    <div style="display: inline-flex;">
                      <v-btn
                        icon
                        small
                        :disabled="isUploading || isSigned"
                        @click="onCropArtworkImageClicked(i)"
                      >
                        <v-icon>mdi-crop</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        small
                        :disabled="isUploading || isSigned"
                        @click="onDeleteArtworkImageClicked(i)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        small
                        :disabled="isUploading || isSigned"
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
                  :accept="accept"
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
            counter="128"
            @input="generateSlugFromTitle"
            :rules="[rules.required, rules.maxLength(128)]"
          ></v-text-field>

          <v-text-field
            v-model="artwork.slug"
            type="text"
            name="artworkSlug"
            counter="128"
            :label="slugBase"
            :rules="[rules.required, rules.maxLength(128), rules.slug]"
          ></v-text-field>

          <v-text-field
            v-model="artwork.created"
            name="artworkCreated"
            label="Created (Year)"
            placeholder="2022"
            :rules="[rules.year]"
          ></v-text-field>

          <v-text-field
            v-model="artwork.city"
            name="artworkCity"
            label="City Code"
            placeholder="NYC"
            :rules="[rules.city]"
          ></v-text-field>

          <v-text-field
            v-model="artwork.medium"
            type="text"
            name="artworkMedium"
            label="Medium"
            counter="240"
            placeholder="e.g. Oil on Canvas, Digital"
            :rules="[rules.maxLength(240)]"
          ></v-text-field>

          <v-textarea
            v-model="artwork.description"
            name="artworkDescription"
            label="Description"
            hint="Enter a description for this Artwork"
            auto-grow
            rows="2"
            counter="1024"
            :rules="[rules.maxLength(1024)]"
          ></v-textarea>

          <LicenseSelector v-model="artwork.license" />
        </v-col>
      </v-row>
      <v-row dense>
        <div class="text-caption">
          Note: Images will have JPEG thumbnail previews generated in 1080p and
          4k resolutions but will not exceed source image dimensions.
        </div>
      </v-row>
      <v-row dense justify="center">
        <TransactionFormControls
          :loading="isUploading"
          :signed="isSigned"
          :txTotal="txTotal"
          :txSize="txSize"
          :info="info"
          :pct="uploadPct"
          @sign="onSign"
          @cancel="onCancel"
          @submit="onSubmit"
        />
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'nuxt-property-decorator'
import draggable from 'vuedraggable'
import Cropper from 'cropperjs'
import Transaction from 'arweave/web/lib/transaction'

import { ArtworkCreationOptions, URLArtworkImage } from '~/types'
import { debounce, uuidv4 } from '~/helpers'
import CitySelector from '~/components/forms/citySelector.component.vue'
import ArtworkTypeSelector from
  '~/components/forms/artworkTypeSelector.component.vue'
import LicenseSelector from '~/components/forms/licenseSelector.component.vue'
import HashtagSelector from '~/components/forms/hashtagSelector.component.vue'
import TransactionFormControls from
  '~/components/forms/transactionFormControls.component.vue'

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
  $refs!: {
    cropImage: HTMLImageElement,
    form: Vue & {
      validate: () => boolean
      resetValidation: () => void
    }
  }
  artwork: ArtworkCreationOptions = {
    creator: this.$auth.user?.address || '',
    title: '',
    slug: '',
    description: '',
    images: []
  }
  cropMode: boolean = false
  cropImage?: URLArtworkImage
  cropImageIndex?: number
  cropper?: Cropper
  valid = false
  dirty = false
  isUploading: boolean = false
  isSigned: boolean = false
  transaction: Transaction | null = null
  info: string = ''
  uploadPct?: number | null = null

  readonly accept = 'image/apng,image/avif,image/gif,image/jpeg,image/png,'
                  + 'image/svg+xml,image/webp'

  @Emit('previewImageChanged') onPreviewImageChanged() {}
  @Emit('save') save(txId: string, slug?: string) {
    return { txId, slug }
  }
  @Emit('cancel') onCancel() {}
  @Emit('uploading') onUploading(isUploading: boolean) { return isUploading }

  rules = {
    required: (value: string = '') => value.length < 1 ? 'Required' : true,
    minLength: (minLength: number) => (value: string = '') => {
      if (!value) {
        return true
      }
      return value.length < minLength
        ? `Minimum 3 characters`
        : true
    },
    maxLength: (maxLength: number) => (value: string = '') => {
      return value.length > maxLength
        ? `Maximum ${maxLength} characters`
        : true
    },
    city: (value: string = '') => {
      if (!value) {
        return true
      }

      const validCityCodeRegex = /^[a-zA-Z]{3}$/

      if (!validCityCodeRegex.test(value)) {
        return 'Must be a valid city code'
      }

      return true
    },
    year: (value: string = '') => {
      if (!value) {
        return true
      }

      const year = Number.parseInt(value)

      if (
        Number.isNaN(year)
        || year > (new Date()).getFullYear()
        || year < 1000
      ) {
        return 'Must be a valid year'
      }

      return true
    },
    slug: (value: string = '') => {
      const validSlugRegex = /^[a-z0-9]+(?:[-_\.]*[a-z0-9]+)*$/

      if (!validSlugRegex.test(value)) {
        return 'Must be a valid URL slug'
          + ' (lowerchase alphanumerics, hyphen, underscore, period),'
          + ' must not end with a hyphen, underscore, or period'
      }

      return true
    }
  }

  get isAtMaxImages(): Boolean {
    if (this.artwork.images.length >= 12) {
      return true
    }

    return false
  }

  get slugBase(): string {
    const username = this.$auth.user.username || this.artwork.creator

    return `artby.city/${username}/`
  }

  get hasImageValidationErrors(): boolean {
    return this.dirty && this.artwork.images.length < 1
  }

  get txTotal() {
    if (this.transaction) {
      return this.transaction.reward
    }

    return undefined
  }

  get txSize() {
    if (this.transaction) {
      return this.transaction.data_size
    }
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
  async onCropArtworkImageClicked(index: number) {
    this.cropMode = true
    this.cropImageIndex = index
    this.cropImage = this.artwork.images[index]
    if (this.cropper) {
      this.cropper.destroy()
    }
    await new Promise<void>(resolve => {
      this.$nextTick(() => {
        this.cropper = new Cropper(
          document.getElementById('cropImage') as HTMLImageElement,
          {
            viewMode: 1,
            ready() {
              resolve()
            }
          }
        )
      })
    })

  }

  @debounce
  onSaveCropSelection() {
    if (this.cropper && typeof this.cropImageIndex !== 'undefined') {
      const type = 'image/png'
      const idx = this.cropImageIndex
      this.cropper.getCroppedCanvas().toBlob(blob => {
        if (blob) {
          this.artwork.images.splice(idx, 1, {
            guid: uuidv4(),
            type,
            url: URL.createObjectURL(blob)
          })

          this.cropMode = false
        }
      })
    }
  }

  @debounce
  onCancelCropSelection() {
    this.cropMode = false
    this.cropper?.destroy()
  }

  async onSign() {
    this.dirty = true
    this.valid = this.$refs.form.validate()

    if (this.hasImageValidationErrors) {
      this.valid = false
    }

    if (this.valid) {
      this.isUploading = true

      this.info = 'Building Artwork transaction...'
      let processedImageCount = 0
      this.uploadPct = 0
      this.transaction = await this.$artworkService.createArtworkTransaction(
        this.artwork,
        ({ idx }: any) => {
          processedImageCount++
          // this.info = `Building Artwork transaction... ${processedImageCount} / ${this.artwork.images.length}`
          this.uploadPct = 100 * (processedImageCount) / this.artwork.images.length
        }
      )

      this.info = 'Waiting on signature...'
      this.isSigned = await this.$arweaveService.sign(this.transaction, true)

      this.info = ''
      this.uploadPct = null
      this.isUploading = false
    }
  }

  async onSubmit() {
    if (this.isSigned && this.transaction) {
      this.isUploading = true
      this.onUploading(true)
      const txId = this.transaction.id
      this.uploadPct = 0
      this.$txQueueService.submitUserTransaction(
        this.transaction,
        {
          id: this.transaction.id,
          last_tx: this.transaction.last_tx,
          type: 'artwork',
          status: 'PENDING_CONFIRMATION',
          created: new Date().getTime()
        },
        (err?: Error) => {
          this.info = ''
          this.uploadPct = null
          this.onUploading(false)
          if (err) {
            console.error('Error submitting user tx', err)
            this.$toastService.error('Error submitting user tx: ' + err.message)
            this.isUploading = false
          } else {
            return this.save(txId, this.artwork.slug)
          }
        },
        true,
        (pctComplete: number) => {
          this.info = `Uploading transaction...`
          this.uploadPct = pctComplete
        }
      )
    }
  }

  private async processAndSetArtworkImage(image: File, index?: number) {
    const urlImage = {
      guid: uuidv4(),
      type: image.type,
      url: URL.createObjectURL(image)
    }

    if (typeof index === 'undefined') {
      index = this.artwork.images.length
      this.artwork.images.push(urlImage)
    } else {
      this.artwork.images[index] = urlImage
    }

    if (index === 0) {
      await this.suggestMetadataFromFile(image)
      this.onPreviewImageChanged()
    }
  }

  private async suggestMetadataFromFile(image: File) {
    // Suggested title is filename without extension
    this.artwork.title = image.name.slice(0, image.name.lastIndexOf('.'))
    this.generateSlugFromTitle()
  }

  private generateSlugFromTitle() {
    this.artwork.slug = this.artwork.title
      .toLowerCase()
      .trim()
      .replace(/[\s]/g, '-')
      .replace(/[^a-z0-9_\-\.]/g, '')
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
