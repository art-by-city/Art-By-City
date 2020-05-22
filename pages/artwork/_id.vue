<template>
  <div v-if="artwork">
    <v-layout column justify-center align-center>
      <h2>{{ artwork.title }}</h2>
      <v-flex xs12 sm8 md6>
        <v-container fluid>
          <v-row>
            <v-col>
              <v-img
                :src="'/artwork-images/' + artwork.images[0].source"
              ></v-img>
              <v-img
                v-for="(image, i) in artwork.images.slice(1)"
                :key="i"
                max-height="50"
                contain
                :src="'/artwork-images/' + image.source"
              ></v-img>
            </v-col>
          </v-row>
          <v-row>
            <v-col><strong>Artist:</strong> {{ artwork.owner.id }}</v-col>
          </v-row>
          <v-row>
            <v-col>
              <strong>Description:</strong> {{ artwork.description }}
            </v-col>
          </v-row>
          <v-row>
            <v-col><strong>Type:</strong> {{ artwork.type }}</v-col>
          </v-row>
          <v-row>
            <v-col><strong>Region:</strong> {{ artwork.region }}</v-col>
          </v-row>
          <v-row>
            <v-col>
              <strong>Hashtags:</strong>
              {{ artwork.hashtags.map((h) => `#${h}`).join(', ') }}
            </v-col>
          </v-row>
          <v-row v-if="$store.state.auth.user.id === artwork.owner.id">
            <v-col>
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

import FormPageComponent from '~/components/pages/formPage.component'

@Component
export default class ArtworkPage extends FormPageComponent {
  artwork: any = {}

  async asyncData({ $axios, params }: Context) {
    try {
      const { payload } = await $axios.$get(`/api/artwork/${params.id}`)

      return { artwork: payload }
    } catch (error) {
      return { errors: error.response.data.messages }
    }
  }

  toggleEditMode(_on?: boolean) {}

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
