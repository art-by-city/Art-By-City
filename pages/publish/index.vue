<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>Publish Artwork</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <v-btn x-large outlined to="/publish/artwork">
          <v-icon x-large>mdi-image</v-icon>
          Image
        </v-btn>
      </v-col>
      <v-col cols="12" class="text-center">
        <v-btn x-large outlined to="/publish/audio">
          <v-icon x-large>mdi-music</v-icon>
          Audio
        </v-btn>
      </v-col>
      <v-col cols="12" class="text-center">
        <v-btn x-large outlined to="/publish/model">
          <v-icon x-large>mdi-cube</v-icon>
          3D
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { ArtworkEditForm } from '~/components/artwork/edit'

@Component({
  middleware: 'auth',
  components: {
    ArtworkEditForm
  }
})
export default class PublishPage extends Vue {
  get head() {
    return { title: 'Publish' }
  }
}
</script>
