<template>
  <v-container class="audio-edit-form">
    Audio Edit Form
  </v-container>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import draggable from 'vuedraggable'
import Cropper from 'cropperjs'

import { PublishingForm } from '~/components/publishing'
import {
  LicenseSelector,
  TransactionFormControls
} from '~/components/forms'
import { AudioArtworkCreationOptions } from '../../../app/core/artwork/audio'
import { uuidv4 } from '../../../app/util'

@Component({
  components: {
    draggable,
    LicenseSelector,
    TransactionFormControls
  }
})
export default class AudioEditForm extends PublishingForm {
  artwork: AudioArtworkCreationOptions = {
    creator: this.$auth.user?.address || '',
    title: '',
    slug: '',
    image: { guid: uuidv4(), url: '', type: '' },
    audio: { guid: uuidv4(), url: '', type: '' }
  }

  async onSign() {
    this.dirty = true
    this.valid = this.$refs.form.validate()

    if (this.valid) {
      this.isUploading = true
      this.info = 'Building Artwork transaction...'
      let processedCount = 0
      this.uploadPct = 0
      this.transaction = await this.$artworkService.createArtworkTransaction(
        this.artwork,
        () => {
          processedCount++
          this.uploadPct = 100 * (processedCount) / 2
        }
      )

    }
  }
}
</script>
