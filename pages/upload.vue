<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="6">
        <ArtworkEditForm
          :artwork="artwork"
          :baseUrl="$config.imgBaseUrl"
          @save="save"
          @cancel="cancel"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'
import { ArtworkEditForm } from '~/components/artwork/edit'
import { NewArtworkRequest } from '~/models/artwork/artwork'
import { debounce } from '~/helpers/helpers'

@Component({
  components: {
    ArtworkEditForm
  }
})
export default class UploadPage extends FormPageComponent {
  artwork!: NewArtworkRequest

  async asyncData({ store }: Context) {
    return {
      artwork: {
        owner: {
          id: store.state.auth.user.id,
          username: store.state.auth.user.username
        },
        title: '',
        slug: '',
        description: '',
        type: '',
        city: store.state.auth.user.city,
        hashtags: [],
        images: []
      }
    }
  }

  @debounce
  async save() {
    const artwork = await this.$artworkService.createArtwork(this.artwork)

    if (artwork) {
      this.$router.push(`/${artwork.owner.username}/${artwork.id}`)
    }
  }

  @debounce
  async cancel() {
    if (confirm('Are you sure you want to cancel this upload?')) {
      // NB: Hard reload the page to clear state and re-render on server
      this.$router.go(0)
    }
  }
}
</script>
