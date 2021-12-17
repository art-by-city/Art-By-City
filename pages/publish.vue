<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="6">
        <ArtworkEditForm
          :artwork="artwork"
          @save="onSave"
          @cancel="onCancel"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'
import { ArtworkEditForm } from '~/components/artwork/edit'
import { Artwork } from '~/types'

@Component({
  middleware: 'auth',
  components: {
    ArtworkEditForm
  }
})
export default class UploadPage extends FormPageComponent {
  get head() {
    return { title: 'Publish' }
  }

  artwork: Artwork = {
    id: '',
    creator: {
      address: this.$auth.user.address
    },
    title: '',
    slug: '',
    description: '',
    hashtags: [],
    images: []
  }

  onSave(txId: string) {
    this.$router.push(`/${this.$auth.user.address}/${txId}`)
  }

  onCancel() {
    if (confirm('Are you sure you want to cancel this upload?')) {
      // NB: Hard reload the page to clear state and re-render on server
      this.$router.go(0)
    }
  }
}
</script>
