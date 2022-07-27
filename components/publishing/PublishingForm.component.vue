<template></template>

<script lang="ts">
import { Component, Emit, Vue } from 'nuxt-property-decorator'
import Transaction from 'arweave/web/lib/transaction'

import { ArtworkCreationOptions } from '~/app/core/artwork'

@Component
export default class PublishingForm extends Vue {
  artwork: Partial<ArtworkCreationOptions> = {}
  $refs!: {
    form: Vue & {
      validate: () => boolean
      resetValidation: () => void
    }
  }
  valid = false
  dirty = false
  isUploading: boolean = false
  isSigned: boolean = false
  transaction: Transaction | null = null
  info: string = ''
  uploadPct?: number | null = null

  @Emit('save') save() {}
  @Emit('cancel') onCancel() {}
  @Emit('uploading') onUploading(isUploading: boolean) { return isUploading }

  get txTotal() {
    if (this.transaction) {
      return this.transaction.reward
    }

    return undefined
  }

  get txSize() {
    if (this.transaction) {
      return this.transaction.data_size
    }
  }

  get slugBase(): string {
    const username = this.$auth.user.username || this.artwork.creator

    return `artby.city/${username}/`
  }

  private generateSlugFromTitle(title: string) {
    this.artwork.slug = title
      .toLowerCase()
      .trim()
      .replace(/[\s]/g, '-')
      .replace(/[^a-z0-9_\-\.]/g, '')
  }

  async suggestMetadataFromFile(file: File) {
    // Suggested title is filename without extension
    this.artwork.title = file.name.slice(0, file.name.lastIndexOf('.'))
    this.generateSlugFromTitle(this.artwork.title)
  }
}
</script>
