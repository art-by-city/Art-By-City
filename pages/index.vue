<template>
  <v-layout column justify-center align-center>
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
              <v-card-text>
                <v-icon>mdi-brush</v-icon> {{ artwork.owner.username }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import PageComponent from '~/components/pages/page.component'

@Component
export default class HomePage extends PageComponent {
  artworks: any[] = []

  async asyncData({ $axios }: Context) {
    try {
      const { payload } = await $axios.$get('/api/artwork')

      return { artworks: payload }
    } catch (error) {
      return { errors: error.response.data.messages }
    }
  }
}
</script>
