<template>
  <div>
    <v-layout column justify-center align-center>
      <h2 class="text-lowercase">My Portfolio</h2>
      <nuxt-link to="/a/new" class="text-lowercase">
        Upload New Artwork
      </nuxt-link>
      <v-container fluid>
        <v-text-field
          class="mb-2"
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
        ></v-text-field>
        <v-row>
          <!-- cols should change depending on breakpoints, but i dont know where to set them -->
          <v-col v-for="(artwork, i) in artworks" :key="i" cols="4">
            <v-lazy transition="fade-transition">
              <template>
                <v-card>
                  <v-img
                    :src="
                      $config.imgBaseUrl +
                        '/artwork-images/' +
                        artwork.images[0].source
                    "
                  >
                    <v-app-bar flat color="rgba(0, 0, 0, 0)">
                      <v-spacer></v-spacer>
                      <v-speed-dial
                        v-model="fab"
                        :direction="direction"
                        :transition="transition"
                      >
                        <template v-slot:activator>
                          <v-btn color="white" icon v-model="fab" fab>
                            <v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>
                        <v-btn fab dark small color="green">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn fab dark small color="indigo">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                        <v-btn fab dark small color="red">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-speed-dial>
                    </v-app-bar>
                  </v-img>

                  <v-card-text>
                    <h2>
                      {{ artwork.title }}
                    </h2>
                    <v-icon v-if="artwork.published">
                      eye-tick-outline
                    </v-icon>
                    <v-icon v-else>eye-remove-outline</v-icon>
                    <!-- content -->
                  </v-card-text>
                </v-card>
              </template>
            </v-lazy>
          </v-col>
        </v-row>
        <!-- <v-data-table :headers="headers" :items="artworks" item-key="id">
          <template v-slot:item.likes="{ item }">
            {{ totalLikes(item) }}
            {{ debug(item) }}
          </template>
          <template v-slot:item.published="{ item }">
            <v-icon>{{
              item ? 'eye-tick-outline' : 'eye-remove-outline'
            }}</v-icon>
          </template>
          <template v-slot:item.images="{ item }">
            <v-img
              :src="
                $config.imgBaseUrl + '/artwork-images/' + item.images[0].source
              "
              width="200"
              height="200"
            ></v-img>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn icon :to="`/a/${item.id}`">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </template>
        </v-data-table> -->
      </v-container>
      <v-btn
        color="blue darken-2"
        nuxt
        to="/a/new"
        dark
        class="text-lowercase upload"
      >
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>
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

  data() {
    return {
      direction: 'bottom',
      fab: false,
      transition: 'slide-y-transition'
    }
  }

  headers = [
    { text: 'title', value: 'title' },
    { text: 'published', value: 'published' },
    { text: 'images', value: 'images' },
    { text: 'type', value: 'type' },
    { text: 'city', value: 'city' },
    { text: 'hashtags', value: 'hashtags' },
    { text: 'likes', value: 'likes' },
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

  debug(item: any) {
    console.log('debugger:', item)
  }
}
</script>

<style>
.upload {
  position: sticky;
}
</style>
