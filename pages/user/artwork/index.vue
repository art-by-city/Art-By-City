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

<script type="ts">
export default {
  middleware: 'role/artist',
  async asyncData({ $axios }) {
    let errors = []
    try {
      const result = await $axios.$get('/api/user/artwork')

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
