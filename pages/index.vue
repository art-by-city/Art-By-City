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
              <v-card-title v-text="artwork.title"></v-card-title>
              <v-card-actions>
                <v-btn icon><v-icon>mdi-heart</v-icon></v-btn>
                <v-btn icon><v-icon>mdi-share-variant</v-icon></v-btn>
              </v-card-actions>
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

      console.log('asyncData result', result)

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
