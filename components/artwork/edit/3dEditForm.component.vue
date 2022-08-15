<template>
  <v-container class="threeD-edit-form">
    <v-form
      ref="form"
      v-model="valid"
      autocomplete="off"
      :disabled="isUploading || isSigned"
    >
      <v-row dense justify="center">
        <ThreeDInput
          v-model="artwork.model"
          @file="on3dFileChanged"
          @previewGenerated="onPreviewImageGenerated"
          @delete="on3dFileDeleted"
          :valid="!has3dValidationErrors"
          :disabled="isUploading || isSigned"
        />
      </v-row>

      <v-row v-if="artwork.image.url" dense justify="center">
        <v-col cols="6">
          <h2>Preview Image</h2>
          <!-- <ImageInput
            v-model="artwork.image"
            :valid="!hasImageValidationErrors"
            :disabled="isUploading || isSigned"
            :max="1"
          /> -->
          <v-img
            aspect-ratio="1.78"
            max-height="300px"
            contain
            :src="artwork.image.url"
          ></v-img>
        </v-col>
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
import { uuidv4 } from '~/app/util'

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

  async onSign() {
    // TODO
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
