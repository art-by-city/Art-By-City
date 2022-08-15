<template>
  <v-container class="threeD-edit-form">
    <v-form
      ref="form"
      v-model="valid"
      autocomplete="off"
      :disabled="isUploading || isSigned"
    >
      <v-row dense justify="center">
        <v-col cols="12">
          <ThreeDInput
            v-model="artwork.model"
            ref="ThreeDInput"
            @file="on3dFileChanged"
            @delete="on3dFileDeleted"
            :valid="!has3dValidationErrors"
            :disabled="isUploading || isSigned"
          />
        </v-col>
      </v-row>

      <v-row dense justify="center">
        <v-col cols="12">
          <v-banner class="caption" outlined tile>
            <v-icon>mdi-exclamation-thick</v-icon>
            <template v-if="artwork.model && artwork.model.url">
              You can click &amp; drag to rotate,
              use the mouse wheel to zoom in and out,
              and the arrow keys to move the camera viewport.
            </template>
            <template v-else>
              Publishing 3D Models is currently limited to
              <a
                class="black--text"
                href="https://en.wikipedia.org/wiki/GlTF"
                target="_blank"
              >GLTF / GLB</a>
              format.  For best results, use GLB.
            </template>
          </v-banner>
        </v-col>
      </v-row>

      <v-row dense justify="center" v-if="artwork.model && artwork.model.url">
        <v-col cols="6">
          <v-btn
            outlined
            elevation="2"
            @click="onGeneratePreviewImageClicked"
          >
            Generate Preview Image from 3D Model
          </v-btn>
        </v-col>
        <v-col cols="6">
          <div class="caption">
            Or upload your own preview image below
            <v-icon>mdi-arrow-down</v-icon>
          </div>
        </v-col>

        <v-col cols="12">
          <ImageInput
            v-model="artwork.image"
            :valid="!hasImageValidationErrors"
            :disabled="isUploading || isSigned"
            :max="1"
          />
        </v-col>
        <!-- <v-img
          aspect-ratio="1.78"
          max-height="300px"
          contain
          :src="artwork.image.url"
        ></v-img> -->
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

          <v-textarea
            v-model="artwork.description"
            name="artworkDescription"
            label="Description"
            hint="Enter a description for this 3D Asset"
            auto-grow
            rows="2"
            counter="1024"
            :rules="[rules.maxLength(1024)]"
          ></v-textarea>

          <!-- <LicenseSelector v-model="artwork.license" /> -->
        </v-col>
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

import { PublishingForm } from '~/components/publishing'
import {
  ImageInput,
  LicenseSelector,
  ThreeDInput,
  TransactionFormControls
} from '~/components/forms'
import { URLArtworkImage } from '~/app/core/artwork'
import { debounce, uuidv4 } from '~/app/util'

@Component({
  components: {
    ImageInput,
    LicenseSelector,
    ThreeDInput,
    TransactionFormControls
  }
})
export default class ThreeDEditForm extends PublishingForm {
  // TODO -> type & default values
  artwork: any = {
    model: {
      url: null
    },
    image: { guid: uuidv4(), url: '', type: '' }
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

  get has3dValidationErrors(): boolean {
    return this.dirty && !this.artwork.model.url
  }

  get hasImageValidationErrors(): boolean {
    return this.dirty && !this.artwork.image.url
  }

  async on3dFileChanged(file: File) {
    await this.suggestMetadataFromFile(file)
    this.artwork.image = { guid: uuidv4(), url: '', type: '' }
  }

  async on3dFileDeleted() {
    this.artwork.image = { guid: uuidv4(), url: '', type: '' }
  }

  async onPreviewImageGenerated(previewImage: URLArtworkImage) {
    this.artwork.image = previewImage
  }

  @debounce
  async onGeneratePreviewImageClicked() {
    try {
      const threeDInputComponent = this.$refs['ThreeDInput'] as ThreeDInput
      this.artwork.image = await threeDInputComponent.generatePreviewImage()
    } catch (err) {
      console.error(err)
    }
  }

  async onSign() {
    this.dirty = true
    this.valid = this.$refs.form.validate()

    if (this.hasImageValidationErrors || this.has3dValidationErrors) {
      this.valid = false
    }

    if (this.valid) {
      this.isUploading = true

      this.info = 'Building Artwork transaction...'
      this.uploadPct = 0
      this.transaction = await this.$artworkService.createArtworkTransaction(
        this.artwork,
        () => { this.uploadPct = 100 }
      )

      this.info = 'Waiting on signature...'
      this.isSigned = await this.$arweaveService.sign(this.transaction, true)

      this.info = ''
      this.uploadPct = null
      this.isUploading = false
    }
  }

  async onSubmit() {
    // TODO
  }
}
</script>

<style scoped>
.threeD-edit-form {
  background-color: white;
  padding: 12px 48px;
  width: 100%;
}
</style>
