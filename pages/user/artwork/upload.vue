<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="4">
        <v-card>
          <v-card-title class="text-lowercase">Upload New Artwork</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="upload">
              <v-text-field
                v-model="artwork.title"
                type="text"
                name="title"
                label="Title"
                :rules="titleRules"
                class="text-lowercase"
              ></v-text-field>

              <v-textarea
                v-model="artwork.description"
                name="description"
                label="Description"
                hint="Enter a description for this Artwork"
                auto-grow
                rows="1"
                :rules="descriptionRules"
                class="text-lowercase"
              ></v-textarea>

              <v-select
                v-model="artwork.type"
                name="type"
                label="Type"
                :items="artworkTypes"
                :rules="typeRules"
                class="text-lowercase"
              >
                <template v-slot:item="{ item }">
                  <span class="text-lowercase">{{ item }}</span>
                </template>
              </v-select>

              <v-select
                v-model="artwork.city"
                name="city"
                label="City"
                :items="cities"
                prepend-icon="mdi-map"
                item-text="name"
                item-value="id"
                item-disabled="disabled"
                :rules="cityRules"
                class="text-lowercase"
              >
                <template v-slot:item="{ item }">
                  <span class="text-lowercase">{{ item.name }}</span>
                </template>
              </v-select>

              <v-combobox
                v-model="artwork.hashtags"
                name="hashtags"
                label="Hashtags"
                class="text-lowercase"
                multiple
                chips
                :items="hashtags"
                no-filter
                hide-selected
                :search-input.sync="hashtagSearchInput"
                @input="onHashtagInput"
                @update:search-input="onHashtagUpdateSearchInput"
              >
                <template v-slot:selection="data">
                  <v-chip
                    :key="JSON.stringify(data.item)"
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    :disabled="data.disabled"
                    class="text-lowercase"
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
                class="text-lowercase"
              ></v-file-input>

              <template v-if="hasErrors">
                <v-alert
                  v-for="(error, i) in errors"
                  :key="i"
                  type="error"
                  class="text-lowercase"
                >
                  {{ error }}
                </v-alert>
              </template>

              <v-btn type="submit" color="primary" class="text-lowercase">
                Upload
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component, Watch } from 'nuxt-property-decorator'
import Fuse from 'fuse.js'

import FormComponent from '~/components/pages/formPage.component'
import { artworkTypes } from '~/models/artwork/artworkOptions'

const MAX_ARTWORK_HASHTAGS = 12
const MAX_ARTWORK_IMAGES = 12

@Component({
  middleware: 'role/artist'
})
export default class ArtworkUploadPage extends FormComponent {
  artworkTypes: string[] = artworkTypes
  cities: string[] = []
  artwork: any = {
    images: []
  }
  hashtags: string[] = this.$store.state.config.hashtags
  fuzzyHashtags = new Fuse(this.hashtags, { includeScore: true })
  hashtagSearchInput: string = ''

  async asyncData({ $axios, store }: Context) {
    const errors = []
    let cities = [] as any[]
    let hashtags = [] as string[]

    try {
      const config = await $axios.$get('/api/config')
      store.commit('config/setConfig', config)
      cities = config.cities
      hashtags = config.hashtags
    } catch (error) {
      errors.push(error.response?.data?.messages)
    }

    return { errors, cities, hashtags }
  }

  get titleRules() {
    return [(value: string = '') => {
      if (value.length < 1) {
        return 'title is required'
      }

      if (value.length > 128) {
        return 'title must be no more than 128 characters'
      }
    }]
  }

  get descriptionRules() {
    return [(value: string = '') => {
      if (value.length > 1024) {
        return 'description must be no more than 1024 characters'
      }
    }]
  }

  get typeRules() {
    return [(value: string = '') => {
      if (!artworkTypes.includes(value)) {
        return `type is required`
      }
    }]
  }

  get cityRules() {
    return [(value: string = '') => {
      if (!this.cities.includes(value)) {
        return `city is required`
      }
    }]
  }

  @Watch('artwork.hashtags')
  enforceMaxHashtags(hashtags: string[]) {
    if (hashtags.length > MAX_ARTWORK_HASHTAGS) {
      this.$nextTick(() => this.artwork.hashtags.pop())
    }
  }

  @Watch('artwork.images')
  enforceMaxImages(images: File[]) {
    if (images.length > MAX_ARTWORK_IMAGES) {
      this.$nextTick(() => this.artwork.images.pop())
    }
  }

  onHashtagInput(hashtags: string[]) {
    this.artwork.hashtags = hashtags.map((h) => {
      return h[0] === '#' ? h.slice(1) : h
    })
    this.hashtagSearchInput = ''
  }

  onHashtagUpdateSearchInput(value: string) {
    if (!value) {
      this.hashtags = this.$store.state.config.hashtags
    } else {
      const result = this.fuzzyHashtags.search(value)

      this.hashtags = result.map((r: any) => r.item)
    }
  }

  async upload() {
    const formDataConfig = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
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
    if (this.artwork.city) {
      formData.append('city', this.artwork.city)
    }
    if (this.artwork.hashtags?.length > 0) {
      formData.append('hashtags', this.artwork.hashtags.join(','))
    }
    if (this.artwork.images?.length > 0) {
      this.artwork.images.forEach((i: File) => formData.append('images', i))
    }

    this.errors = []
    try {
      const result = await this.$axios.$put(
        '/api/artwork/',
        formData,
        formDataConfig
      )

      if (result.success && result.payload) {
        this.$router.push(`/artwork/${result.payload.id}`)
      }
    } catch (error) {
      this.errors = [error?.response?.data?.error?.message]
    }
  }
}
</script>

<style scoped>
.text-lowercase >>> input {
  text-transform: lowercase;
}
.text-lowercase >>> .v-label {
  text-transform: lowercase;
}
.text-lowercase >>> .v-select__selection {
  text-transform: lowercase;
}
</style>
