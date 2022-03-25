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
import { Component, Vue } from 'nuxt-property-decorator'

import { ArtworkEditForm } from '~/components/artwork/edit'

@Component({
  middleware: 'auth',
  components: {
    ArtworkEditForm
  }
})
export default class UploadPage extends Vue {
  get head() {
    return { title: 'Publish' }
  }

  isUploading: boolean = false

  beforeRouteLeave(to: any, from: any, next: Function) {
    if (!this.isUploading) {
      next()
    } else {
      alert('Cannot navigate away while publication upload is in progress.')
    }
  }

  onSave({ txId, slug }: { txId: string, slug: string }) {
    const profileUrl = this.$auth.user.username || this.$auth.user.address
    if (profileUrl) {
      this.$router.push(`/${profileUrl}?publishSuccess=true`)
    }
  }

  onCancel() {
    if (confirm('Are you sure you want to cancel this publication?')) {
      this.$router.back()
    }
  }

  onUploading(isUploading: boolean) {
    this.isUploading = isUploading
  }
}
</script>
