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
              <AvatarUploadInput v-model="asset" />
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
import { Component } from 'nuxt-property-decorator'

import { ArtworkImage, UserTransaction } from '~/types'
import TransactionDialog from
  '~/components/common/TransactionDialog.component.vue'
import TransactionFormControls from
  '~/components/forms/transactionFormControls.component.vue'
import AvatarUploadInput from './AvatarUploadInput.component.vue'
import { uuidv4 } from '~/helpers'

@Component({
  components: {
    TransactionFormControls,
    AvatarUploadInput
  }
})
export default class AvatarUploadDialog extends TransactionDialog<ArtworkImage> {
  fetchOnServer = false
  async fetch() {
    if (this.$auth.user && this.$auth.user.address) {
      const avatar = await this.$avatarService.fetchAvatar(
        this.$auth.user.address
      )

      if (avatar) {
        // NB: resolve mime type from data url src quickly
        // maybe this is faster than .split() ?
        let imageType = avatar.src.substring(5, 14)
        // data:image/jpe
        if (imageType[6] === 'j') {
          imageType += 'g'
        }

        this.asset = {
          guid: uuidv4(),
          imageType,
          dataUrl: avatar.src
        }
      }
    }
  }

  async onSubmit() {
    if (this.asset) {
      this.isUploading = true

      const transaction = await this.$avatarService.createAvatarTransaction(
        { src: this.asset.dataUrl }
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
}
</script>
