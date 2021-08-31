<template>
  <v-dialog
    :value="open"
    persistent
    @click:outside="onCloseDialog"
    width="400"
  >
    <v-container dense class="pa-1">
      <v-row dense>
        <v-col dense cols="12" class="pa-0">
          <v-card>
            <v-card-title>Upload Avatar</v-card-title>
            <v-card-text>
              <ImageFileInput v-model="images" />
            </v-card-text>
            <v-card-actions>
              <TransactionFormControls
                :transaction="transaction"
                :loading="isUploading"
                @cancel="onCancel"
                @submit="onSubmit"
              />
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Emit, PropSync, Watch } from 'nuxt-property-decorator'
import Transaction from 'arweave/node/lib/transaction'

import { debounce } from '~/helpers'
import { ArtworkImage } from '~/types'
import TransactionFormControls from '~/components/forms/transactionFormControls.component.vue'
import ProgressService from '~/services/progress/service'

@Component({
  components: {
    TransactionFormControls
  }
})
export default class AvatarUploadDialog extends Vue {
  images: ArtworkImage[] = []
  @Watch('images', {
    deep: true,
    immediate: true
  }) async onImagesChanges(images: ArtworkImage[]) {
    if (images.length > 0) {
      this.transaction = await this.$avatarService.createAvatarTransaction(
        { src: images[0].dataUrl }
      )
    }
  }
  transaction: Transaction | null = null
  isUploading: boolean = false

  @PropSync('show', {
    type: Boolean,
    required: false
  }) open?: boolean

  @Emit('upload') onUpload(txId: string): string {
    return txId
  }

  async onSubmit() {
    const valid = this.images.length > 0

    if (valid) {
      const txId = await this.submitTransaction()

      if (txId) {
        return this.onUpload(txId)
      }
    }
  }

  private async submitTransaction(): Promise<string | undefined> {
    if (this.transaction) {
      this.isUploading = true
      ProgressService.start()
      try {
        await this.$arweave.transactions.sign(this.transaction)
        const res = await this.$arweave.transactions.post(this.transaction)

        if (res.status === 200 || res.status === 208) {
          return this.transaction.id
        }
      } catch (error) {
        this.$toastService.error(error)
      } finally {
        this.isUploading = false
        ProgressService.stop()
      }
    }
  }

  private close() {
    this.open = false
    this.images = []
  }

  @debounce
  onCloseDialog() {
    if (!this.isUploading) {
      this.close()
    }
  }

  onCancel() {
    this.close()
  }
}
</script>