<template>
  <div v-if="artwork">
    <v-layout column justify-center align-center>
      <h2 class="text-lowercase">{{ artwork.title }}</h2>
      <v-flex xs12 sm8 md6>
        <v-container fluid>
          <v-row justify="center">
            <v-col cols="12">
              <v-img
                :src="getImageSource(artwork.images[imagePreviewIndex])"
                max-width="500"
                max-height="500"
                contain
              ></v-img>
              {{ artwork.images.length }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4" v-for="(image, i) in artwork.images" :key="i">
              <v-hover v-slot:default="hoverProps">
                <v-img
                  max-width="250"
                  max-height="250"
                  aspect-ratio="1.7"
                  :src="getImageSource(image)"
                  class="clickable"
                  :class="isHighlighted(i)"
                  @click="previewImage(i)"
                >
                  <v-overlay absolute :value="editMode && hoverProps.hover">
                    <v-file-input
                      class="artwork-upload-button"
                      accept="image/*"
                      hide-input
                      prepend-icon="mdi-camera"
                      @change="onArtworkImageChanged(i, $event)"
                    ></v-file-input>
                    <div style="display: inline-flex;">
                      <v-btn
                        icon
                        small
                        @click="onDeleteArtworkImageClicked(i)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                      <!-- <v-btn
                        icon
                        small
                      >
                        <v-icon>mdi-drag-variant</v-icon>
                      </v-btn> -->
                    </div>
                  </v-overlay>
                </v-img>
              </v-hover>
            </v-col>
            <v-col cols="4" v-if="editMode && !isAtMaxImages">
              <v-responsive
                aspect-ratio="1.7"
                max-width="250"
                max-height="250"
                style="border: 1px dashed black;">
                <v-file-input
                  class="artwork-upload-button add-artwork-image-button"
                  accept="image/*"
                  hide-input
                  prepend-icon="mdi-camera"
                  @change="onAddArtworkImageClicked"
                ></v-file-input>
              </v-responsive>
            </v-col>
          </v-row>
          <v-row>
            <LikeButton :artwork="artwork"/>
          </v-row>
          <v-row>
            <v-col class="text-lowercase">
              <strong>Artist:</strong>
              <nuxt-link :to="`/user/${artwork.owner.username}`">
                {{ artwork.owner.username }}
              </nuxt-link>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-lowercase">
              <template v-if="!editMode">
                <strong>Title:</strong> {{ artwork.title }}
              </template>
              <template v-if="editMode">
                <v-text-field
                  v-model="artwork.title"
                  type="text"
                  name="title"
                  label="Title"
                  class="text-lowercase"
                  :rules="titleRules"
                  autocomplete="new-password"
                ></v-text-field>
              </template>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-lowercase">
              <template v-if="!editMode">
                <strong>Description:</strong> {{ artwork.description }}
              </template>
              <template v-if="editMode">
                <v-textarea
                  v-model="artwork.description"
                  name="description"
                  label="Description"
                  hint="Enter a description for this Artwork"
                  auto-grow
                  rows="1"
                  class="text-lowercase"
                  :rules="descriptionRules"
                  autocomplete="new-password"
                ></v-textarea>
              </template>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-lowercase">
              <template v-if="!editMode">
                <strong>Type:</strong> {{ artwork.type }}
              </template>
              <template v-else>
                <ArtworkTypeSelector
                  v-model="artwork.type"
                  :artworkTypes="config.artworkTypes"
                  required
                />
              </template>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-lowercase">
              <template v-if="!editMode">
                <strong>City:</strong> {{ cityName }}
              </template>
              <template v-else>
                <CitySelector
                  v-model="artwork.city"
                  :cities="config.cities"
                  required
                />
              </template>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-lowercase">
              <template v-if="!editMode">
                <strong>Hashtags:</strong>
                {{ hashtagsString }}
              </template>
              <template v-if="editMode">
                <HashtagSelector
                  v-model="artwork.hashtags"
                  :hashtags="config.hashtags"
                />
              </template>
            </v-col>
          </v-row>
          <v-row v-if="isOwnerOrAdmin">
            <v-col class="text-lowercase">
              <strong>Published: {{ artwork.published ? 'yes' : 'no' }}</strong>
              <v-simple-checkbox v-model="artwork.published" disabled></v-simple-checkbox>
            </v-col>
          </v-row>
          <v-row v-if="isOwnerOrAdmin">
            <v-col class="text-lowercase">
              <strong>Approved: {{ artwork.approved ? 'yes' : 'no' }}</strong>
              <v-simple-checkbox v-model="artwork.approved" disabled></v-simple-checkbox>
            </v-col>
          </v-row>
          <v-row v-if="isOwnerOrAdmin">
            <v-col v-if="!editMode && isOwner">
              <v-btn color="primary" @click="toggleEditMode">Edit</v-btn>
            </v-col>
            <v-col v-if="editMode && isOwner">
              <v-btn color="primary" @click="saveArtwork">Save</v-btn>
              <v-btn color="warning" @click="onCancelClicked">Cancel</v-btn>
            </v-col>
            <v-col v-if="!editMode && isOwnerOrAdmin">
              <v-btn color="primary" @click="publishOrApproveArtwork('publish')">
                {{ artwork.published ? 'Unpublish' : 'Publish' }}
              </v-btn>
            </v-col>
            <v-col v-if="!editMode && isAdmin">
              <v-btn color="primary" @click="publishOrApproveArtwork('approve')">
                {{ artwork.approved ? 'Unapprove' : 'Approve' }}
              </v-btn>
            </v-col>
            <v-col v-if="editMode && isOwner">
              <v-btn color="error" @click="deleteArtwork">Delete</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'
import Fuse from 'fuse.js'

import LikeButton from '~/components/likeButton.component.vue'
import CitySelector from '~/components/forms/citySelector.component.vue'
import ArtworkTypeSelector from '~/components/forms/artworkTypeSelector.component.vue'
import HashtagSelector from '~/components/forms/hashtagSelector.component.vue'
import FormPageComponent from '~/components/pages/formPage.component'
import Artwork, {
  ArtworkImageFile,
  ImageFileRef,
  isImageFileRef,
  isFile,
  ImageUploadRequest,
  isImageUploadPreview,
  ImageUploadPreview
} from '~/models/artwork/artwork'
import ArtworkType from '~/models/artwork/artworkType'
import ToastService from '~/services/toast/service'
import ProgressService from '~/services/progress/service'
import { ConfigStoreState } from '~/store/config'
import { readFileAsBinaryStringAsync, debounce } from '~/helpers/helpers'

@Component({
  components: {
    LikeButton,
    CitySelector,
    ArtworkTypeSelector,
    HashtagSelector
  }
})
export default class ArtworkPage extends FormPageComponent {
  artwork!: Artwork
  config: ConfigStoreState = this.$store.state.config
  fuzzyHashtags = new Fuse(this.config.hashtags, { includeScore: true })
  hashtagSearchInput: string = ''

  editMode = false
  imagePreviewIndex = 0
  cachedArtwork!: Artwork

  async asyncData({ $axios, store, params }: Context) {
    try {
      const { payload } = await $axios.$get(`/api/artwork/${params.id}`)

      if (!payload.city) {
        payload.city = null
      }

      const config = await $axios.$get('/api/config')
      store.commit('config/setConfig', config)

      return {
        artwork: payload,
        config: config
      }
    } catch (error) {
      ToastService.error(`error fetching artwork or app config: ${error}`)
    }
  }

  created() {
    this.toggleEditMode = debounce(this.toggleEditMode)
    this.onCancelClicked = debounce(this.onCancelClicked)
    this.onArtworkImageChanged = debounce(this.onArtworkImageChanged)
    this.onAddArtworkImageClicked = debounce(this.onAddArtworkImageClicked)
    this.onDeleteArtworkImageClicked = debounce(this.onDeleteArtworkImageClicked)
    this.saveArtwork = debounce(this.saveArtwork)
    this.deleteArtwork = debounce(this.deleteArtwork)
    this.publishOrApproveArtwork = debounce(this.publishOrApproveArtwork)
  }

  get isOwner() {
    return this.$store.state?.auth?.user?.id === this.artwork?.owner.id
  }

  get isAdmin() {
    return this.$store.state?.auth?.user?.roles?.includes('admin')
  }

  get isOwnerOrAdmin() {
    return this.isOwner || this.isAdmin
  }

  get cityName() {
    for (let i = 0; i < this.config.cities.length; i++) {
      if (this.config.cities[i].id === this.artwork.city) {
        return this.config.cities[i].name
      }
    }
  }

  get hashtagsString() {
    return this.artwork.hashtags.map((h) => { return `#${h}` }).join(', ')
  }

  get titleRules() {
    return [(value: string = '') => {
      if (value.length < 1) {
        return 'title is required'
      }

      if (value.length > 128) {
        return 'title must be no more than 128 characters'
      }

      return true
    }]
  }

  get descriptionRules() {
    return [(value: string = '') => {
      if (value.length > 1024) {
        return 'description must be no more than 1024 characters'
      }

      return true
    }]
  }

  get isAtMaxImages(): Boolean {
    // TODO -> Get from admin configuration
    if (this.artwork.images.length >= 12) {
      return true
    }

    return false
  }

  isHighlighted(i: number) {
    return this.imagePreviewIndex === i ? 'highlighted' : ''
  }

  getImageSource(image: ArtworkImageFile) {
    if (isImageFileRef(image)) {
      return `/artwork-images/${(<ImageFileRef>image).source}`
    }

    if (isImageUploadPreview(image)) {
      return `data:${image.type};base64, ${image.ascii}`
    }

    return ''
  }

  previewImage(index: number) {
    if (!this.editMode) {
      this.imagePreviewIndex = index
    }
  }

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

  onCancelClicked() {
    this.artwork = Object.assign({}, this.artwork, this.cachedArtwork)
    this.toggleEditMode(false)
  }

  async onArtworkImageChanged(index: number, image: File) {
    this.artwork.images.splice(
      index,
      1,
      {
        ascii: btoa(await readFileAsBinaryStringAsync(image)),
        type: image.type
      } as ImageUploadPreview
    )
  }

  async onAddArtworkImageClicked(image: File) {
    this.artwork.images.splice(
      this.artwork.images.length,
      0,
      {
        ascii: btoa(await readFileAsBinaryStringAsync(image)),
        type: image.type
      } as ImageUploadPreview
    )
  }

  async onDeleteArtworkImageClicked(index: number) {
    this.artwork.images.splice(index, 1)
  }

  async saveArtwork() {
    const artwork = await this.$artworkService.updateArtwork(this.artwork)

    if (artwork) {
      this.artwork = Object.assign({}, this.artwork, artwork)
      this.toggleEditMode(false)
    }
  }

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
        ToastService.success(`artwork updated`)
      }
    } catch (error) {
      ToastService.error(`error updating artwork`)
    }
    ProgressService.stop()
  }

  async deleteArtwork() {
    if (confirm('Are you sure you want to delete this artwork?')) {
      ProgressService.start()
      try {
        const { success } = await this.$axios.$delete(
          `/api/artwork/${this.artwork.id}`
        )

        if (success) {
          ToastService.success('artwork deleted')
          this.$router.push(`/`)
        }
      } catch (error) {
        ToastService.error('error deleting artwork')
      }
      ProgressService.stop()
    }
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
.highlighted {
  border: 2px solid black;
}
.artwork-upload-button.v-text-field {
  margin-top: 0px;
  display: inline-flex;
  align-items: center;
  padding: 2px;
}
.artwork-upload-button >>> .v-input__control {
  display: none;
}
.artwork-upload-button >>> .v-input__prepend-outer {
  margin-right: 0px;
  margin-left: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
}
.add-artwork-image-button {
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
