<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="6">
        <ArtworkEditForm
          :artwork="artwork"
          @save="save"
          @cancel="cancel"
          :loading="isLoading"
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
import { debounce } from '~/helpers/helpers'
import ProgressService from '~/services/progress/service'

@Component({
  middleware: 'auth',
  components: {
    ArtworkEditForm
  }
})
export default class UploadPage extends FormPageComponent {
  artwork: Artwork = {
    creator: {
      address: this.$auth.user.address
    },
    title: '',
    slug: '',
    description: '',
    hashtags: [],
    images: []
  }

  isLoading = false

  @debounce
  async save(valid?: boolean) {
    if (!valid) { return }

    ProgressService.start()
    this.isLoading = true
    try {
      const artwork = await this.$artworkService.createArtwork(this.artwork)

      if (artwork) {
        const profile = artwork.creator.address
        const slug = artwork.id
        this.$router.push(`/${profile}/${slug}`)
      }
    } catch (error) {
      this.$toastService.error(error)
    } finally {
      ProgressService.stop()
    }
  }

  @debounce
  cancel() {
    if (confirm('Are you sure you want to cancel this upload?')) {
      // NB: Hard reload the page to clear state and re-render on server
      this.$router.go(0)
    }
  }
}
</script>
