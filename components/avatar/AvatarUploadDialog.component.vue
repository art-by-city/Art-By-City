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
import { readFileAsDataUrlAsync, uuidv4 } from '~/helpers'

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

      if (avatar && avatar.src) {
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
          url: avatar.src
        }
      }
    }
  }

  async onSign() {
    if (this.asset) {
      this.isUploading = true
      this.info = 'Processing avatar...'

      const guid = this.asset.guid
      const type = this.asset.imageType
      const file = await fetch(this.asset.url)
        .then(r => r.blob())
        .then(blob => new File([blob], guid, { type }))
      const src = await readFileAsDataUrlAsync(file)

      this.info = 'Building avatar transaction...'
      this.transaction = await this.$avatarService.createAvatarTransaction(
        { src }
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
    console.log('avataruploaddialog ondirty')
    this.isDirty = true
  }
}
</script>
