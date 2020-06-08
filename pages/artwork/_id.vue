<template>
  <div v-if="artwork">
    <v-layout column justify-center align-center>
      <h2>{{ artwork.title }}</h2>
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
            <v-col><strong>Artist:</strong> {{ artwork.owner.username }}</v-col>
          </v-row>
          <v-row>
            <v-col>
              <template v-if="!editMode">
                <strong>Title:</strong> {{ artwork.title }}
              </template>
              <template v-if="editMode">
                <v-text-field
                  v-model="artwork.title"
                  type="text"
                  name="title"
                  label="Title"
                ></v-text-field>
              </template>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
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
                ></v-textarea>
              </template>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <template v-if="!editMode">
                <strong>Type:</strong> {{ artwork.type }}
              </template>
              <template v-if="editMode">
                <v-select
                  v-model="artwork.type"
                  name="type"
                  label="Type"
                  :items="artworkTypes"
                ></v-select>
              </template>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <template v-if="!editMode">
                <strong>Region:</strong> {{ artwork.region }}
              </template>
              <template v-if="editMode">
                <v-select
                  v-model="artwork.region"
                  name="region"
                  label="Region"
                  :items="regions"
                ></v-select>
              </template>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
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
                  @input="onHashtagInput"
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
        </v-container>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import { artworkTypes, regions } from '~/server/core/artwork/validator'
import LikeButton from '~/components/likeButton.component.vue'
import FormPageComponent from '~/components/pages/formPage.component'

@Component({
  components: {
    LikeButton
  }
})
export default class ArtworkPage extends FormPageComponent {
  artwork: any = {}
  artworkTypes: string[] = artworkTypes
  regions: string[] = regions
  editMode = false
  imagePreviewIndex = 0

  get isOwner() {
    return this.$store.state?.auth?.user?.id === this.artwork?.owner?.id
  }

  async asyncData({ $axios, params }: Context) {
    try {
      const { payload } = await $axios.$get(`/api/artwork/${params.id}`)

      return { artwork: payload }
    } catch (error) {
      return { errors: error.response.data.messages }
    }
  }

  get previewImageSource() {
    return (
      '/artwork-images/' + this.artwork.images[this.imagePreviewIndex].source
    )
  }

  onHashtagInput(hashtags: string[]) {
    this.artwork.hashtags = hashtags.map((h) => {
      return h[0] === '#' ? h.slice(1) : h
    })
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
