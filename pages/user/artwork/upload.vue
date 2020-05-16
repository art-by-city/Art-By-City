<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="4">
        <v-card>
          <v-card-title>Upload New Artwork</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="upload">
              <v-text-field
                v-model="artwork.title"
                type="text"
                name="title"
                label="Title"
                :rules="titleRules"
              ></v-text-field>

              <v-textarea
                v-model="artwork.description"
                name="description"
                label="Description"
                hint="Enter a description for this Artwork"
                auto-grow
                rows="1"
                :rules="descriptionRules"
              ></v-textarea>

              <v-select
                v-model="artwork.type"
                name="type"
                label="Type"
                :items="artworkTypes"
                :rules="required"
              ></v-select>

              <v-select
                v-model="artwork.region"
                name="region"
                label="Region"
                :items="regions"
                :rules="required"
              ></v-select>

              <v-combobox
                v-model="artwork.hashtags"
                name="hashtags"
                label="Hashtags"
                multiple
                chips
              >
                <template v-slot:selection="data">
                  <v-chip
                    :key="JSON.stringify(data.item)"
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    :disabled="data.disabled"
                    @click:close="data.parent.selectItem(data.item)"
                  >
                    # {{ data.item }}
                  </v-chip>
                </template>
              </v-combobox>

              <v-file-input
                v-model="artwork.images"
                name="images"
                label="Images"
                prepend-icon="mdi-camera"
                accept="image/png, image/jpeg"
                multiple
                chips
              ></v-file-input>

              <template v-if="errors.length > 0">
                <v-alert v-for="(error, i) in errors" :key="i" type="error">
                  {{ error }}
                </v-alert>
              </template>

              <v-btn type="submit" color="primary">Upload</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script type="ts">
import { required } from '~/server/core/validators'
import {
  titleRules,
  descriptionRules,
  typeRules,
  regionRules
} from '~/server/core/artwork/validator'
import { artworkTypes, regions } from '~/server/core/artwork/artwork.interface'

export default {
  middleware: 'role/artist',
  data() {
    return {
      errors: [],
      valid: false,
      artworkTypes,
      regions,
      artwork: {
        images: []
      }
    }
  },
  computed: {
    required,
    titleRules,
    descriptionRules,
    typeRules,
    regionRules
  },
  watch: {
    model: 'validateForm'
  },
  methods: {
    validateForm() {
      this.$refs.form.validate()
    },
    async upload() {
      const formDataConfig = { headers: {
        'Content-Type': 'multipart/form-data'
      }}
      const formData = new FormData()
      if (this.artwork.title) {
        formData.append('title', this.artwork.title)
      }
      if (this.artwork.description) {
        formData.append('description', this.artwork.description)
      }
      if (this.artwork.type) {
        formData.append('type', this.artwork.type)
      }
      if (this.artwork.region) {
        formData.append('region', this.artwork.region)
      }
      if (this.artwork.hashtags?.length > 0) {
        formData.append('hashtags', this.artwork.hashtags.join(','))
      }
      if (this.artwork.images?.length > 0) {
        this.artwork.images.forEach((i) => formData.append('images', i))
      }

      this.errors = []
      try {
        const result = await this.$axios.$put('/api/artwork/', formData, formDataConfig)
        console.log('artwork upload result', result)
      } catch (error) {
        this.errors = [error?.response?.data?.error?.message]
      }
    }
  }
}
</script>
