<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="6">
        <ArtworkEditForm
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

  onSave({ txId, slug }: { txId: string, slug: string }) {
    const profileUrl = this.$auth.user.username || this.$auth.user.address
    if (profileUrl) {
      this.$router.push(`/${profileUrl}/${slug || txId}`)
    }
  }

  onCancel() {
    if (confirm('Are you sure you want to cancel this upload?')) {
      // NB: Hard reload the page to clear state and re-render on server
      this.$router.go(0)
    }
  }
}
</script>
