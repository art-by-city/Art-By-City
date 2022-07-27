<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>Publish 3D</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="6">
        <ThreeDEditForm
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
import { ThreeDEditForm } from '~/components/artwork/edit'

@Component({
  middleware: 'auth',
  components: {
    ThreeDEditForm
  }
})
export default class Publish3dPage extends PublishingPage {
  get head() {
    return { title: 'Publish 3D' }
  }
}
</script>
