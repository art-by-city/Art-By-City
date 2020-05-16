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
              <!-- <v-card-actions>
                <v-btn icon><v-icon>mdi-heart</v-icon></v-btn>
                <v-btn icon><v-icon>mdi-share-variant</v-icon></v-btn>
              </v-card-actions> -->
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    let errors = []
    try {
      const result = await $axios.$get('/api/artwork')

      return { errors, artworks: result.payload }
    } catch (error) {
      errors = error.response.data.messages
    }

    return { errors, artworks: [] }
  },
  data() {
    return {
      artworks: []
    }
  }
}
</script>
