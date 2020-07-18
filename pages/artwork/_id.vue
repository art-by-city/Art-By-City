<template>
  <div v-if="artwork">
    <v-layout column justify-center align-center>
      <h2 class="text-lowercase">{{ artwork.title }}</h2>
      <v-flex xs12 sm8 md6>
        <v-container fluid>
          <v-row justify="center">
            <v-col cols="12">
              <v-img
                :src="previewImageSource"
                max-width="500"
                max-height="500"
                contain
              ></v-img>
            </v-col>
          </v-row>
          <v-row>
            <v-col v-for="(image, i) in artwork.images" :key="i">
              <v-img
                max-width="250"
                max-height="250"
                aspect-ratio="1.7"
                :src="'/artwork-images/' + image.source"
                class="clickable"
                :class="isHighlighted(i)"
                @click="previewImage(i)"
              ></v-img>
            </v-col>
          </v-row>
          <v-row><LikeButton :artwork="artwork"/></v-row>
          <v-row>
            <v-col class="text-lowercase">
              <strong>Artist:</strong> {{ artwork.owner.username }}
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-lowercase">
              <template v-if="!editMode">
                <strong>Title:</strong> {{ artwork.title }}
              </template>
              <template v-if="editMode">
                <v-text-field
                  v-model="artwork.title"
                  type="text"
                  name="title"
                  label="Title"
                  class="text-lowercase"
                  :rules="titleRules"
                ></v-text-field>
              </template>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-lowercase">
              <template v-if="!editMode">
                <strong>Description:</strong> {{ artwork.description }}
              </template>
              <template v-if="editMode">
                <v-textarea
                  v-model="artwork.description"
                  name="description"
                  label="Description"
                  hint="Enter a description for this Artwork"
                  auto-grow
                  rows="1"
                  class="text-lowercase"
                  :rules="descriptionRules"
                ></v-textarea>
              </template>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-lowercase">
              <template v-if="!editMode">
                <strong>Type:</strong> {{ artwork.type }}
              </template>
              <template v-if="editMode">
                <v-select
                  v-model="artwork.type"
                  name="type"
                  label="Type"
                  :items="artworkTypes"
                  class="text-lowercase"
                  :rules="typeRules"
                >
                  <template v-slot:item="{ item }">
                    <span class="text-lowercase">{{ item }}</span>
                  </template>
                </v-select>
              </template>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-lowercase">
              <template v-if="!editMode">
                <strong>City:</strong> {{ cityName }}
              </template>
              <template v-if="editMode">
                <v-select
                  v-model="artwork.city"
                  name="city"
                  label="City"
                  item-text="name"
                  item-value="id"
                  item-disabled="disabled"
                  :items="cities"
                  class="text-lowercase"
                  :rules="cityRules"
                >
                  <template v-slot:item="{ item }">
                    <span class="text-lowercase">{{ item.name }}</span>
                  </template>
                </v-select>
              </template>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-lowercase">
              <template v-if="!editMode">
                <strong>Hashtags:</strong>
                {{ artwork.hashtags.map((h) => `#${h}`).join(', ') }}
              </template>
              <template v-if="editMode">
                <v-combobox
                  v-model="artwork.hashtags"
                  name="hashtags"
                  label="Hashtags"
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
                      @click:close="data.parent.selectItem(data.item)"
                    >
                      # {{ data.item }}
                    </v-chip>
                  </template>
                </v-combobox>
              </template>
            </v-col>
          </v-row>
          <v-row v-if="isOwner">
            <v-col v-if="!editMode">
              <v-btn color="primary" @click="toggleEditMode">Edit</v-btn>
            </v-col>
            <v-col v-if="editMode">
              <v-btn color="primary" @click="saveArtwork">Save</v-btn>
            </v-col>
            <v-col v-if="editMode">
              <v-btn color="error" @click="deleteArtwork">Delete</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'
import Fuse from 'fuse.js'

import LikeButton from '~/components/likeButton.component.vue'
import FormPageComponent from '~/components/pages/formPage.component'
import { artworkTypes } from '~/models/artwork/artworkOptions'

@Component({
  components: {
    LikeButton
  }
})
export default class ArtworkPage extends FormPageComponent {
  artwork: any = {}
  artworkTypes: string[] = artworkTypes
  cities: any[] = this.$store.state.config.cities
  hashtags: string[] = this.$store.state.config.hashtags
  fuzzyHashtags = new Fuse(this.hashtags, { includeScore: true })
  hashtagSearchInput: string = ''

  editMode = false
  imagePreviewIndex = 0

  async asyncData({ $axios, store, params }: Context) {
    try {
      const { payload } = await $axios.$get(`/api/artwork/${params.id}`)

      if (!payload.city) {
        payload.city = null
      }

      const config = await $axios.$get('/api/config')
      store.commit('config/setConfig', config)

      return {
        artwork: payload,
        cities: config.cities,
        hashtags: config.hashtags
      }
    } catch (error) {
      console.error(error)
      return { errors: error.response?.data?.messages }
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

  get isOwner() {
    return this.$store.state?.auth?.user?.id === this.artwork?.owner.id
  }

  get cityName() {
    for (let i = 0; i < this.cities.length; i++) {
      if (this.cities[i].id === this.artwork.city) {
        return this.cities[i].name
      }
    }
  }

  get previewImageSource() {
    return (
      '/artwork-images/' + this.artwork.images[this.imagePreviewIndex].source
    )
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

  isHighlighted(i: number) {
    return this.imagePreviewIndex === i ? 'highlighted' : ''
  }

  previewImage(index: number) {
    this.imagePreviewIndex = index
  }

  toggleEditMode(enabled?: boolean) {
    if (typeof enabled !== 'undefined') {
      this.editMode = !!enabled
    } else {
      this.editMode = !this.editMode
    }
  }

  async saveArtwork() {
    try {
      const { success } = await this.$axios.$post(
        `/api/artwork/${this.artwork.id}`,
        this.artwork
      )

      if (success) {
        this.toggleEditMode(false)
      }
    } catch (error) {
      this.errors = error.response.data.messages
    }
  }

  async deleteArtwork() {
    if (confirm('Are you sure you want to delete this artwork?')) {
      try {
        const { success } = await this.$axios.$delete(
          `/api/artwork/${this.artwork.id}`
        )

        if (success) {
          this.$router.push(`/`)
        }
      } catch (error) {
        this.errors = error.response.data.messages
      }
    }
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
}

.highlighted {
  border: 2px solid black;
}
</style>
