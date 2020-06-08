<template>
  <div>
    <v-layout column justify-center align-center>
      <h2>My Artwork</h2>
      <nuxt-link to="/user/artwork/upload">Upload New</nuxt-link>
      <v-container fluid>
        <v-data-table :headers="headers" :items="artworks" item-key="id">
          <template v-slot:item.likes="{ item }">
            {{ totalLikes(item) }}
          </template>
          <template v-slot:item.images="{ item }">
            <v-img
              :src="'/artwork-images/' + previewImageSource(item)"
              width="100"
              height="100"
            ></v-img>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn icon :to="`/artwork/${item.id}`">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-container>
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

  headers = [
    { text: 'title', value: 'title' },
    { text: 'type', value: 'type' },
    { text: 'region', value: 'region' },
    { text: 'hashtags', value: 'hashtags' },
    { text: 'likes', value: 'likes' },
    { text: 'images', value: 'images' },
    { text: 'actions', value: 'actions' }
  ]

  async asyncData({ $axios }: Context) {
    try {
      const { payload } = await $axios.$get('/api/user/artwork')

      return { artworks: payload }
    } catch (error) {
      return { errors: error.response.data.messages }
    }
  }

  totalLikes(artwork: any) {
    return artwork.likes?.length || 0
  }

  previewImageSource(artwork: any) {
    return artwork.images[0].source
  }
}
</script>
