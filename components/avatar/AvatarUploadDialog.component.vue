<template>
  <v-dialog
    :value="open"
    persistent
    @click:outside="onCloseDialog"
    width="300"
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
              <v-btn
                text
                outlined
                color="error"
                :disabled="isUploading"
                @click="onCancelClicked"
              >
                Cancel
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                text
                outlined
                color="primary"
                :loading="isUploading"
                :disabled="isUploading"
                @click="onUploadClicked"
              >
                Upload
              </v-btn>
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
import { ArtworkImage, Avatar } from '~/types'

@Component
export default class AvatarUploadDialog extends Vue {
  images: ArtworkImage[] = []
  isUploading: boolean = false

  @PropSync('show', {
    type: Boolean,
    required: false
  }) open?: boolean

  @Emit('upload') onUpload(avatar: Avatar): Avatar {
    return avatar
  }

  @debounce
  async onUploadClicked() {
    if (this.images.length > 0) {
      const avatar = {
        src: this.images[0].dataUrl
      }

      this.isUploading = true
      try {
        const uploadedAvatar = await this.$avatarService.uploadAvatar(avatar)
        if (uploadedAvatar) {
          this.onUpload(uploadedAvatar)
          this.close()
        }
      } catch (error) {
        this.$toastService.error(error)
      } finally {
        this.isUploading = false
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

  @debounce
  onCancelClicked() {
    this.close()
  }
}
</script>
