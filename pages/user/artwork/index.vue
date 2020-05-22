<template>
  <div>
    <v-layout column justify-center align-center>
      <h2>My Artwork</h2>
      <nuxt-link to="/user/artwork/upload">Upload New</nuxt-link>
      <v-flex xs12 sm8 md6>
        <v-container fluid>
          <v-row dense>
            <v-col v-for="(artwork, i) in artworks" :key="i" cols="auto">
              <v-card>
                <v-img
                  :src="'/artwork-images/' + artwork.images[0].source"
                ></v-img>
                <v-card-title>
                  <nuxt-link :to="`/artwork/${artwork.id}`">
                    {{ artwork.title }}
                  </nuxt-link>
                </v-card-title>
              </v-card>
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

import PageComponent from '~/components/pages/page.component'

@Component({
  middleware: 'role/artist'
})
export default class UserArtworkPage extends PageComponent {
  artworks: any = []

  async asyncData({ $axios }: Context) {
    try {
      const { payload } = await $axios.$get('/api/user/artwork')

      return { artworks: payload }
    } catch (error) {
      return { errors: error.response.data.messages }
    }
  }
}
</script>
