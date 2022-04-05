<template>
  <v-container>
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
import PublishingPage from
  '~/components/publishing/PublishingPage.component.vue'

@Component({
  middleware: 'auth',
  components: {
    ArtworkEditForm
  }
})
export default class PublishPage extends PublishingPage {
  get head() {
    return { title: 'Publish' }
  }
}
</script>
