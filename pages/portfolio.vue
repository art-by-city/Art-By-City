<template>
  <div>
    <v-layout column justify-center align-center>
      <h2 class="text-lowercase">My Portfolio</h2>
      <nuxt-link to="/a/new" class="text-lowercase">
        Upload New Artwork
      </nuxt-link>
      <v-container fluid>
        <v-data-table :headers="headers" :items="artworks" item-key="id">
          <template v-slot:item.likes="{ item }">
            {{ totalLikes(item) }}
          </template>
          <template v-slot:item.images="{ item }">
            <v-img
              :src="$config.imgBaseUrl + '/artwork-images/' + item.images[0].source"
              width="100"
              height="100"
            ></v-img>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn icon :to="`/a/${item.id}`">
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
  middleware: 'auth'
})
export default class UserArtworkPage extends PageComponent {
  artworks: any[] = []
  cities: any[] = []

  headers = [
    { text: 'title', value: 'title' },
    { text: 'type', value: 'type' },
    { text: 'city', value: 'city' },
    { text: 'hashtags', value: 'hashtags' },
    { text: 'likes', value: 'likes' },
    { text: 'images', value: 'images' },
    { text: 'actions', value: 'actions' }
  ]

  async asyncData({ $axios, store }: Context) {
    try {
      const { payload } = await $axios.$get('/api/user/portfolio')
      const cities = store.state.config.cities

      return {
        cities,
        artworks: payload.map((a: any) => {
          for (let i = 0; i < cities.length; i++) {
            if (cities[i].id === a.city) {
              a.city = cities[i].name
            }
          }
          return a
        })
      }
    } catch (error) {
      console.error(error)
      return { errors: error.response?.data?.messages }
    }
  }

  totalLikes(artwork: any) {
    return artwork.likes?.length || 0
  }

  cityName(cityId: string) {
    for (let i = 0; i < this.cities.length; i++) {
      if (this.cities[i].id === cityId) {
        return this.cities[i].name
      }
    }
  }
}
</script>
