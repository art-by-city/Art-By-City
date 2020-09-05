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
              <strong>Artist:</strong>
              <nuxt-link :to="`/user/${artwork.owner.username}`">
                {{ artwork.owner.username }}
              </nuxt-link>
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
                  autocomplete="new-password"
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
                  autocomplete="new-password"
                ></v-textarea>
              </template>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-lowercase">
              <template v-if="!editMode">
                <strong>Type:</strong> {{ artwork.type }}
              </template>
              <template v-else>
                <ArtworkTypeSelector
                  v-model="artwork.type"
                  :artworkTypes="artworkTypes"
                  required
                />
              </template>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-lowercase">
              <template v-if="!editMode">
                <strong>City:</strong> {{ cityName }}
              </template>
              <template v-else>
                <CitySelector
                  v-model="artwork.city"
                  :cities="cities"
                  required
                />
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
                <HashtagSelector
                  v-model="artwork.hashtags"
                  :hashtags="hashtags"
                />
              </template>
            </v-col>
          </v-row>
          <v-row v-if="isOwnerOrAdmin">
            <v-col class="text-lowercase">
              <strong>Published: {{ artwork.published ? 'yes' : 'no' }}</strong>
              <v-simple-checkbox v-model="artwork.published" disabled></v-simple-checkbox>
            </v-col>
          </v-row>
          <v-row v-if="isOwnerOrAdmin">
            <v-col class="text-lowercase">
              <strong>Approved: {{ artwork.approved ? 'yes' : 'no' }}</strong>
              <v-simple-checkbox v-model="artwork.approved" disabled></v-simple-checkbox>
            </v-col>
          </v-row>
          <v-row v-if="isOwnerOrAdmin">
            <v-col v-if="!editMode && isOwner">
              <v-btn color="primary" @click="toggleEditMode">Edit</v-btn>
            </v-col>
            <v-col v-if="editMode && isOwner">
              <v-btn color="primary" @click="saveArtwork">Save</v-btn>
            </v-col>
            <v-col v-if="!editMode && isOwnerOrAdmin">
              <v-btn color="primary" @click="publishOrApproveArtwork('publish')">
                {{ artwork.published ? 'Unpublish' : 'Publish' }}
              </v-btn>
            </v-col>
            <v-col v-if="!editMode && isAdmin">
              <v-btn color="primary" @click="publishOrApproveArtwork('approve')">
                {{ artwork.approved ? 'Unapprove' : 'Approve' }}
              </v-btn>
            </v-col>
            <v-col v-if="editMode && isOwner">
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
import CitySelector from '~/components/forms/citySelector.component.vue'
import ArtworkTypeSelector from '~/components/forms/artworkTypeSelector.component.vue'
import HashtagSelector from '~/components/forms/hashtagSelector.component.vue'
import FormPageComponent from '~/components/pages/formPage.component'
import Artwork from '~/models/artwork/artwork'
import ArtworkType from '~/models/artwork/artworkType'
import ToastService from '~/services/toast/service'

@Component({
  components: {
    LikeButton,
    CitySelector,
    ArtworkTypeSelector,
    HashtagSelector
  }
})
export default class ArtworkPage extends FormPageComponent {
  artwork!: Artwork
  cities: any[] = this.$store.state.config.cities
  hashtags: string[] = this.$store.state.config.hashtags
  artworkTypes: ArtworkType[] = this.$store.state.config.artworkTypes
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
        hashtags: config.hashtags,
        artworkTypes: config.artworkTypes
      }
    } catch (error) {
      ToastService.error(`error fetching artwork or app config: ${error}`)
    }
  }

  get isOwner() {
    return this.$store.state?.auth?.user?.id === this.artwork?.owner.id
  }

  get isAdmin() {
    return this.$store.state?.auth?.user?.roles?.includes('admin')
  }

  get isOwnerOrAdmin() {
    return this.isOwner || this.isAdmin
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
        ToastService.success('artwork saved')
      }
    } catch (error) {
      ToastService.error('error saving artwork')
    }
  }

  async publishOrApproveArtwork(intent: 'publish' | 'approve') {
    try {
      const action = intent === 'publish'
        ? this.artwork.published
          ? 'unpublish'
          : 'publish'
        : this.artwork.approved
          ? 'unapprove'
          : 'approve'
      const { success } = await this.$axios.$post(`/api/artwork/${this.artwork.id}/${action}`)

      if (success) {
        const published = intent === 'publish' ? !this.artwork.published : this.artwork.published
        const approved = intent === 'approve' ? !this.artwork.approved : this.artwork.approved
        this.artwork = {
          ...this.artwork,
          published,
          approved
        }
        ToastService.success(`artwork updated`)
      }
    } catch (error) {
      ToastService.error(`error updating artwork`)
    }
  }

  async deleteArtwork() {
    if (confirm('Are you sure you want to delete this artwork?')) {
      try {
        const { success } = await this.$axios.$delete(
          `/api/artwork/${this.artwork.id}`
        )

        if (success) {
          ToastService.success('artwork deleted')
          this.$router.push(`/`)
        }
      } catch (error) {
        ToastService.error('error deleting artwork')
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
