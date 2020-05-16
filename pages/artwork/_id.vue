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
                max-height="50"
                contain
                :key="i"
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

<script type="ts">
export default {
  async asyncData({ $axios, params }) {
    let errors = []
    try {
      const result = await $axios.$get(`/api/artwork/${params.id}`)

      return { errors, artwork: result.payload }
    } catch (error) {
      errors = error.response.data.messages
    }

    return { errors, artwork: null }
  },
  data() {
    return {
      artwork: null
    }
  },
  methods: {
    async deleteArtwork() {
      if (confirm('Are you sure you want to delete this artwork?')) {
        try {
          const result = await this.$axios.$delete(`/api/artwork/${this.artwork.id}`)

          if (result.success) {
            this.$router.push(`/`)
          }
        } catch (error) {
          this.errors = [error?.response?.data?.error?.message]
        }
      }
    }
  }
}
</script>
