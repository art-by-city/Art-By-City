<template>
  <v-container class="artwork-edit-form">
    <v-form
      ref="form"
      v-model="valid"
      autocomplete="off"
      :disabled="isUploading || isSigned"
    >
      <v-row dense justify="center">
        <ImageInput
          v-model="artwork.images"
          @primary="onPrimaryImageChanged"
          :valid="!hasImageValidationErrors"
          :disabled="isUploading || isSigned"
          :max="12"
        />
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

          <!-- <v-text-field
            v-model="artwork.city"
            name="artworkCity"
            label="City Code"
            placeholder="NYC"
            :rules="[rules.city]"
          ></v-text-field> -->

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

          <!-- <LicenseSelector v-model="artwork.license" /> -->
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
import { Component } from 'nuxt-property-decorator'

import { ImageArtworkCreationOptions } from '~/app/core'
import { PublishingForm } from '~/components/publishing'
import {
  LicenseSelector,
  TransactionFormControls,
  ImageInput
} from '~/components/forms'

@Component({
  components: {
    ImageInput,
    LicenseSelector,
    TransactionFormControls
  }
})
export default class ArtworkEditForm extends PublishingForm {
  artwork: ImageArtworkCreationOptions = {
    subCategory: 'image',
    creator: this.$auth.user?.address || '',
    title: '',
    slug: '',
    description: '',
    images: []
  }

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

  get hasImageValidationErrors(): boolean {
    return this.dirty && this.artwork.images.length < 1
  }

  async onPrimaryImageChanged(image: File) {
    await this.suggestMetadataFromFile(image)
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
        () => {
          processedImageCount++
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
      this.uploadPct = 0
      this.$txQueueService.submitUserTransaction(
        this.transaction,
        {
          id: this.transaction.id,
          last_tx: this.transaction.last_tx,
          type: 'artwork',
          status: 'PENDING_SUBMISSION',
          created: new Date().getTime()
        },
        (err?: Error) => {
          this.info = ''
          this.uploadPct = null
          this.onUploading(false)
          if (err) {
            console.error('Error submitting user tx', err)
            this.$toasts.error('Error submitting user tx: ' + err.message)
            this.isUploading = false
          } else {
            return this.save()
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
}
</script>

<style scoped>
.artwork-edit-form {
  background-color: white;
  padding: 12px 48px;
  width: 100%;
}
</style>
