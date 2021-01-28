<template>
  <div>
    <v-container v-if="artwork">
      <v-row v-if="previewImage" dense justify="center">
        <v-img
          class="preview-artwork"
          max-height="75vh"
          max-width="75vw"
          :src="getImageSource(previewImage, $config.imgBaseUrl)"
          contain
          @click="onPreviewArtworkClicked"
        ></v-img>
      </v-row>
      <v-row dense justify="center">
        <div class="artwork-image-selector-container">
          <div
            class="artwork-image-selector"
            v-for="(image, i) in artwork.images"
            :key="i"
          >
            <v-img
              aspect-ratio="1.7"
              :src="getImageSource(image, $config.imgBaseUrl)"
              class="clickable"
              :class="{ 'highlighted': image === previewImage }"
              @click="setPreviewImage(image)"
            >
            </v-img>
          </div>
        </div>
      </v-row>
      <v-row dense justify="center">
        <v-col cols="10">
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col offset="2" cols="5">
          <v-row dense>
            <span class="text-lowercase text-h2">{{ artwork.title }}</span>
            <div style="align-self: flex-end">
              <LikeButton :artwork="artwork"/>
            </div>
          </v-row>
          <v-row dense>
            <div class="text-lowercase" style="width: 100%">
              {{ artwork.description }}
            </div>
          </v-row>
        </v-col>
        <v-col cols="5">
          <ArtistTag
            :user="artwork.owner"
            :baseUrl="$config.imgBaseUrl"
          />
          <div class="text-lowercase">{{ artwork.type }}</div>
          <div class="text-lowercase">{{ cityName }}</div>
          <div class="text-lowercase">{{ hashtagsString }}</div>
        </v-col>
      </v-row>

      <ArtworkEditControls
        :isNew="!artwork.id"
        :isOwner="isOwner"
        :isAdmin="isAdmin"
        :editMode="editMode"
        :published="artwork.published"
        :approved="artwork.approved"
        @edit="toggleEditMode"
        @save="saveArtwork"
        @cancel="onCancelClicked"
        @delete="deleteArtwork"
        @publish="publishOrApproveArtwork('publish')"
        @approve="publishOrApproveArtwork('approve')"
      />

      <ArtworkZoomDialog
        v-if="previewImage"
        :show.sync="zoom"
        :src="getImageSource(previewImage, $config.imgBaseUrl)"
      />

      <v-dialog
        :value="editMode"
        persistent
        max-width="40vw"
      >
        <ArtworkEditForm
          :artwork="artwork"
          :baseUrl="$config.imgBaseUrl"
          @previewImageChanged="setPreviewImage()"
        />
      </v-dialog>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import LikeButton from '~/components/likeButton.component.vue'
import FormPageComponent from '~/components/pages/formPage.component'
import ArtworkZoomDialog from '~/components/artwork/ArtworkZoomDialog.component.vue'
import ArtworkEditControls from '~/components/artwork/ArtworkEditControls.component.vue'
import ArtworkEditForm from '~/components/artwork/ArtworkEditForm.component.vue'
import Artwork, {
  ArtworkImageFile,
  getImageSource
} from '~/models/artwork/artwork'
import ProgressService from '~/services/progress/service'
import { debounce } from '~/helpers/helpers'

@Component({
  components: {
    LikeButton,
    ArtworkZoomDialog,
    ArtworkEditControls,
    ArtworkEditForm
  }
})
export default class ArtworkPage extends FormPageComponent {
  artwork!: Artwork
  previewImage?: ArtworkImageFile
  cachedArtwork!: Artwork
  editMode = false
  zoom = false

  getImageSource = getImageSource

  async asyncData({ $axios, store, params, app, error }: Context) {
    let artwork, previewImage
    let editMode = false

    try {
      if (params.id !== 'new') {
        const { payload } = await $axios.$get(`/api/artwork/${params.id}`)

        if (!payload.city) {
          payload.city = null
        }

        artwork = payload
        previewImage = payload.images[0]
      } else {
        artwork = {
          owner: {
            id: store.state.auth.user.id,
            username: store.state.auth.user.username
          },
          images: [],
          hashtags: [],
          likes: [],
          type: '',
          city: store.state.auth.user.city,
          published: false,
          approved: false
        }
        previewImage = null
        editMode = true
      }
    } catch (err) {
      if (err.response?.status === 404) {
        return error({ statusCode: 404, message: 'artwork not found' })
      } else {
        app.$toastService.error('error fetching artwork')
      }
    } finally {
      return { artwork, previewImage, editMode }
    }
  }

  get isNew() {
    return !this.artwork.id || this.artwork.id === 'new'
  }

  get isOwner() {
    return this.$store.state?.auth?.user?.id === this.artwork?.owner?.id
  }

  get isAdmin() {
    return this.$store.state?.auth?.user?.roles?.includes('admin')
  }

  get isOwnerOrAdmin() {
    return this.isOwner || this.isAdmin
  }

  get cityName() {
    for (let i = 0; i < this.$store.state.config.cities.length; i++) {
      if (this.$store.state.config.cities[i].id === this.artwork.city) {
        return this.$store.state.config.cities[i].name
      }
    }
  }

  get hashtagsString() {
    return this.artwork.hashtags.map((h) => { return `#${h}` }).join(', ')
  }

  setPreviewImage(image?: ArtworkImageFile) {
    this.previewImage = image
      ? image
      : this.artwork.images[0]
  }

  @debounce
  onPreviewArtworkClicked() {
    this.zoom = true
  }

  @debounce
  toggleEditMode(forceState?: boolean) {
    if (!this.editMode) {
      this.cachedArtwork = { ...this.artwork }
      this.cachedArtwork.images = [ ...this.artwork.images ]
    }
    if (typeof forceState !== 'undefined') {
      this.editMode = !!forceState
    } else {
      this.editMode = !this.editMode
    }
  }

  @debounce
  onCancelClicked() {
    if (this.isNew) {
      this.$router.push('/portfolio')
    } else {
      this.artwork = Object.assign({}, this.artwork, this.cachedArtwork)
      this.toggleEditMode(false)
    }
  }

  @debounce
  async saveArtwork() {
    const artwork = this.isNew
      ? await this.$artworkService.createArtwork(this.artwork)
      : await this.$artworkService.updateArtwork(this.artwork)

    if (artwork) {
      if (this.isNew) {
        this.previewImage = artwork.images[0]
        window.history.replaceState(window.history.state, document.title, `/a/${artwork.id}`)
      }
      this.artwork = Object.assign({}, this.artwork, artwork)
      this.toggleEditMode(false)
    }
  }

  @debounce
  async publishOrApproveArtwork(intent: 'publish' | 'approve') {
    ProgressService.start()
    try {
      const action = intent === 'publish'
        ? this.artwork.published
          ? 'unpublish'
          : 'publish'
        : this.artwork.approved
          ? 'unapprove'
          : 'approve'
      const { success } = await this.$axios.$post(`/api/artwork/${this.artwork.id}/${action}`)

      if (success) {
        const published = intent === 'publish' ? !this.artwork.published : this.artwork.published
        const approved = intent === 'approve' ? !this.artwork.approved : this.artwork.approved
        this.artwork = {
          ...this.artwork,
          published,
          approved
        }
        this.$toastService.success(`artwork updated`)
      }
    } catch (error) {
      this.$toastService.error(`error updating artwork`)
    }
    ProgressService.stop()
  }

  @debounce
  async deleteArtwork() {
    if (confirm('Are you sure you want to delete this artwork?')) {
      ProgressService.start()
      try {
        const { success } = await this.$axios.$delete(
          `/api/artwork/${this.artwork.id}`
        )

        if (success) {
          this.$toastService.success('artwork deleted')
          this.$router.push('/portfolio')
        }
      } catch (error) {
        this.$toastService.error('error deleting artwork')
      }
      ProgressService.stop()
    }
  }
}
</script>

<style scoped>
.preview-artwork {
  cursor: zoom-in;
}
.clickable {
  cursor: pointer;
}
.highlighted {
  border: 2px solid black;
}
.artwork-image-selector {
  height: 56px;
  width: 96px;
  margin: 5px;
}
</style>
