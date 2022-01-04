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
            <v-divider></v-divider>
            <v-card-text>
              <AvatarUploadInput v-model="image" />
            </v-card-text>
            <v-card-actions>
              <TransactionFormControls
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
import { Vue, Component, Emit, PropSync } from 'nuxt-property-decorator'

import { debounce } from '~/helpers'
import { ArtworkImage, UserTransaction } from '~/types'
import TransactionFormControls from
  '~/components/forms/transactionFormControls.component.vue'
import AvatarUploadInput from './AvatarUploadInput.component.vue'

@Component({
  components: {
    TransactionFormControls,
    AvatarUploadInput
  }
})
export default class AvatarUploadDialog extends Vue {
  image: ArtworkImage | null = null
  isUploading: boolean = false

  @PropSync('show', {
    type: Boolean,
    required: false
  }) open?: boolean

  @Emit('upload') onUpload(txId: string): string {
    return txId
  }

  async onSubmit() {
    if (this.image) {
      this.isUploading = true

      const transaction = await this.$avatarService.createAvatarTransaction(
        { src: this.image.dataUrl }
      )

      const signed = await this.$arweaveService.sign(transaction)

      if (signed) {
        const tx: UserTransaction = {
          transaction,
          type: 'avatar',
          status: 'PENDING_CONFIRMATION',
          created: new Date().getTime()
        }

        this.$txQueueService.submitUserTransaction(tx, (err?: Error) => {
          if (err) {
            this.$toastService.error(err.message)
            this.isUploading = false
          } else {
            this.close()
          }
        })
      } else {
        this.isUploading = false
      }
    }
  }

  private close() {
    this.open = false
    this.image = null
    this.isUploading = false
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
