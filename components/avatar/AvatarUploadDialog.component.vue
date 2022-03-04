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
            <v-card-text class="pb-0">
              <AvatarUploadInput
                v-model="asset"
                :disabled="isUploading || isSigned"
                @cropmode="onCropModeToggled"
                @dirty="onDirty"
              />

              <div class="text-caption">
                Avatars will be resized to 400 by 400 pixels.
              </div>
              <div class="text-caption">
                Animated GIFs will not be resized but are restricted to 5MB.
              </div>
            </v-card-text>
            <v-card-actions class="pt-0">
              <TransactionFormControls
                :info="info"
                :disabled="asset === null || !isDirty || isCropping"
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

import { DomainEntityCategory, URLArtworkImage } from '~/types'
import TransactionDialog from
  '~/components/common/TransactionDialog.component.vue'
import TransactionFormControls from
  '~/components/forms/transactionFormControls.component.vue'
import AvatarUploadInput from './AvatarUploadInput.component.vue'
import { readFileAsArrayBufferAsync, uuidv4 } from '~/helpers'

@Component({
  components: {
    TransactionFormControls,
    AvatarUploadInput
  }
})
export default class AvatarUploadDialog
  extends TransactionDialog<URLArtworkImage> {
  type: DomainEntityCategory = 'avatar'
  isCropping: boolean = false
  info: string = ''

  fetchOnServer = false
  async fetch() {
    if (this.$auth.user && this.$auth.user.address) {
      const avatar = await this.$avatarService.fetchAvatar(
        this.$auth.user.address
      )

      if (avatar) {
        this.asset = {
          type: avatar.type,
          url: avatar.src
        }
      }
    }
  }

  async onSign() {
    if (this.asset) {
      this.isUploading = true
      this.info = 'Processing avatar...'

      const type = this.asset.type
      const blob = await fetch(this.asset.url).then(r => r.blob())
      const buffer = await readFileAsArrayBufferAsync(blob)

      this.info = 'Building avatar transaction...'
      this.transaction = await this.$avatarService.createAvatarTransaction(
        buffer,
        type
      )

      this.info = 'Waiting on signature...'
      this.isSigned = await this.$arweaveService.sign(this.transaction)

      this.info = ''
      this.isUploading = false
    }
  }

  onCropModeToggled(enabled: boolean) {
    this.isCropping = enabled
  }

  onDirty() {
    this.isDirty = true
  }
}
</script>
