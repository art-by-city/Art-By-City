<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>Publish Audio</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="6">
        <AudioEditForm
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

import { AudioEditForm } from '~/components/artwork/edit'
import { PublishingPage } from '~/components/publishing'

@Component({
  middleware: 'auth',
  components: {
    AudioEditForm
  }
})
export default class PublishAudioPage extends PublishingPage {
  get head() {
    return { title: 'Publish Audio' }
  }
}
</script>
