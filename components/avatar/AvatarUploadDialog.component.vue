<template>
  <v-dialog
    :value="open"
    persistent
    width="400"
  >
    <v-container dense class="pa-1">
      <v-row dense>
        <v-col dense cols="12" class="pa-0">
          <v-card>
            <v-card-title>Upload Avatar</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <AvatarUploadInput
                v-model="asset"
                :disabled="isUploading || isSigned"
              />
            </v-card-text>
            <v-card-actions>
              <TransactionFormControls
                :loading="isUploading"
                :signed="isSigned"
                :txTotal="txTotal"
                @sign="onSign"
                @submit="onSubmit"
                @cancel="onCancel"
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

import { ArtworkImage, DomainEntityCategory, UserTransaction } from '~/types'
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
export default class AvatarUploadDialog
  extends TransactionDialog<ArtworkImage> {
  type: DomainEntityCategory = 'avatar'

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

  async onSign() {
    if (this.asset) {
      this.isUploading = true

      this.transaction = await this.$avatarService.createAvatarTransaction(
        { src: this.asset.dataUrl }
      )

      this.isSigned = await this.$arweaveService.sign(this.transaction)

      this.isUploading = false
    }
  }
}
</script>
