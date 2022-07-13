<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>Publish Artwork</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="6">
        <ArtworkEditForm
          @uploading="onUploading"
          @save="onSave"
          @cancel="onCancel"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'

import { ArtworkEditForm } from '~/components/artwork/edit'
import { PublishingPage } from '~/components/publishing'

@Component({
  middleware: 'auth',
  components: {
    ArtworkEditForm
  }
})
export default class PublishArtworkPage extends PublishingPage {
  get head() {
    return { title: 'Publish Artwork' }
  }
}
</script>
