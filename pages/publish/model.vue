<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>Publish 3D</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="6">
        <ModelEditForm
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

import { PublishingPage } from '~/components/publishing'
import { ModelEditForm } from '~/components/artwork/edit'

@Component({
  middleware: 'auth',
  components: {
    ModelEditForm
  }
})
export default class PublishModelPage extends PublishingPage {
  get head() {
    return { title: 'Publish 3D' }
  }
}
</script>
