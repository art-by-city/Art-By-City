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
                autocomplete="new-password"
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
                autocomplete="new-password"
              ></v-textarea>

              <ArtworkTypeSelector
                v-model="artwork.type"
                :artworkTypes="artworkTypes"
                required
              />

              <CitySelector
                v-model="artwork.city"
                :cities="cities"
                required
              />

              <HashtagSelector
                v-model="artwork.hashtags"
                :hashtags="hashtags"
              />

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
import CitySelector from '~/components/forms/citySelector.component.vue'
import ArtworkTypeSelector from '~/components/forms/artworkTypeSelector.component.vue'
import HashtagSelector from '~/components/forms/hashtagSelector.component.vue'
import ArtworkType from '~/models/artwork/artworkType'
import ToastService from '~/services/toast/service'
import ProgressService from '~/services/progress/service'
import { debounce } from '~/helpers/helpers'

const MAX_ARTWORK_IMAGES = 12

@Component({
  components: {
    CitySelector,
    ArtworkTypeSelector,
    HashtagSelector
  }
})
export default class ArtworkUploadPage extends FormComponent {
  artworkTypes: string[] = this.$store.state.config.artworkTypes
  cities: string[] = []
  artwork: any = {
    title: '',
    description: '',
    type: '',
    city: '',
    hashtags: [],
    images: []
  }
  hashtags: string[] = this.$store.state.config.hashtags
  fuzzyHashtags = new Fuse(this.hashtags, { includeScore: true })
  hashtagSearchInput: string = ''

  async asyncData({ $axios, store }: Context) {
    let cities = [] as any[]
    let hashtags = [] as string[]
    let artworkTypes = [] as ArtworkType[]

    try {
      const config = await $axios.$get('/api/config')
      store.commit('config/setConfig', config)
      cities = config.cities
      hashtags = config.hashtags
      artworkTypes = config.artworkTypes
    } catch (error) {
      ToastService.error('error fetching config')
    }

    return { cities, hashtags, artworkTypes }
  }

  created() {
    this.upload = debounce(this.upload)
  }

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

  @Watch('artwork.images')
  enforceMaxImages(images: File[]) {
    if (images.length > MAX_ARTWORK_IMAGES) {
      this.$nextTick(() => this.artwork.images.pop())
    }
  }

  async upload() {
    const artwork = await this.$artworkService.createArtwork(this.artwork)

    if (artwork) {
      this.$router.push(`/artwork/${artwork.id}`)
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
