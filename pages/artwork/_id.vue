<template>
  <v-container>
    <v-row dense justify="center">
      <v-img
        max-height="75vh"
        max-width="75vw"
        :src="getImageSource(previewImage)"
        contain
        @click="onPreviewArtworkClicked"
      ></v-img>
    </v-row>
    <v-row dense justify="center">
      <div class="artwork-image-selector-container">
        <draggable
          style="height:100%; width:100%; display: flex; flex-wrap: wrap;"
          :list="artwork.images"
          :disabled="!editMode"
          handle=".drag-handle"
        >
          <div
            class="artwork-image-selector"
            v-for="(image, i) in artwork.images"
            :key="i"
          >
            <v-hover v-slot:default="hoverProps">
              <v-img
                aspect-ratio="1.7"
                :src="getImageSource(image)"
                class="clickable"
                :class="{ 'highlighted': image === previewImage }"
                @click="setPreviewImage(image)"
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
                    <v-btn
                      icon
                      small
                      class="drag-handle"
                    >
                      <v-icon>mdi-drag-variant</v-icon>
                    </v-btn>
                  </div>
                </v-overlay>
              </v-img>
            </v-hover>
          </div>
          <div class="artwork-image-selector" v-if="editMode && !isAtMaxImages">
            <v-responsive
              aspect-ratio="1.7"
              style="border: 1px dashed black;"
            >
              <v-file-input
                class="artwork-upload-button add-artwork-image-button"
                accept="image/*"
                hide-input
                prepend-icon="mdi-camera-plus"
                @change="onAddArtworkImageClicked"
              ></v-file-input>
            </v-responsive>
          </div>
        </draggable>
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
          <template v-if="!editMode">
            <span class="text-lowercase text-h2">{{ artwork.title }}</span>
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
          <div v-if="!editMode" style="align-self: flex-end">
            <LikeButton :artwork="artwork"/>
          </div>
        </v-row>
        <v-row dense>
          <div class="text-lowercase" style="width: 100%">
            <template v-if="!editMode">
              {{ artwork.description }}
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
          </div>
        </v-row>
      </v-col>
      <v-col cols="5">
        <ArtistTag :user="artwork.owner" />

        <div class="text-lowercase">
          <template v-if="!editMode">
            {{ artwork.type }}
          </template>
          <template v-else>
            <ArtworkTypeSelector
              v-model="artwork.type"
              :artworkTypes="$store.state.config.artworkTypes"
              required
            />
          </template>
        </div>

        <div class="text-lowercase">
          <template v-if="!editMode">
            {{ cityName }}
          </template>
          <template v-else>
            <CitySelector
              v-model="artwork.city"
              :cities="$store.state.config.cities"
              required
            />
          </template>
        </div>

        <div class="text-lowercase">
          <template v-if="!editMode">
            {{ hashtagsString }}
          </template>
          <template v-if="editMode">
            <HashtagSelector
              v-model="artwork.hashtags"
              :hashtags="$store.state.config.hashtags"
            />
          </template>
        </div>
      </v-col>
    </v-row>

    <v-card
      v-if="isOwnerOrAdmin"
      class="artwork-actions"
      tile
      elevation="5"
    >
      <v-list dense min-width="150px">
        <v-list-item>
          <v-list-item-content>
            <v-checkbox
              v-model="artwork.published"
              disabled
              label="published"
            />
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-checkbox
              v-model="artwork.approved"
              disabled
              label="approved"
            />
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="!editMode && isOwner">
          <v-list-item-content>
            <v-btn small color="primary" @click="toggleEditMode">Edit</v-btn>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="editMode && isOwner">
          <v-list-item-content>
            <v-btn small color="primary" @click="saveArtwork">Save</v-btn>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="editMode && isOwner">
          <v-list-item-content>
            <v-btn small color="warning" @click="onCancelClicked">Cancel</v-btn>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="!editMode && isOwnerOrAdmin">
          <v-list-item-content>
            <v-btn small color="primary" @click="publishOrApproveArtwork('publish')">
              {{ artwork.published ? 'Unpublish' : 'Publish' }}
            </v-btn>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="!editMode && isAdmin">
          <v-list-item-content>
            <v-btn small color="primary" @click="publishOrApproveArtwork('approve')">
              {{ artwork.approved ? 'Unapprove' : 'Approve' }}
            </v-btn>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="editMode && isOwner">
          <v-list-item-content>
            <v-btn small color="error" @click="deleteArtwork">Delete</v-btn>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>

    <v-dialog
      class="artwork-zoom-dialog"
      :value="zoom"
      @click:outside="onCloseZoomDialog"
      @click="onCloseZoomDialog"
      max-height="95vh"
      max-width="95vw"
    >
      <div @click="onCloseZoomDialog">
        <img
          class="artwork-zoom-image"
          :class="{ 'dragging': isZoomDragging }"
          :src="getImageSource(previewImage)"
          :style="`left: ${zoomLeft}px; top: ${zoomTop}px`"
          @mousemove="onZoomDialogMouseMove"
          @mousedown="onZoomDialogMouseDown"
          @mouseup="onZoomDialogMouseUp"
        />
      </div>
    </v-dialog>

  </v-container>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'
import Fuse from 'fuse.js'
import draggable from 'vuedraggable'

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
import { readFileAsBinaryStringAsync, debounce } from '~/helpers/helpers'

@Component({
  components: {
    LikeButton,
    CitySelector,
    ArtworkTypeSelector,
    HashtagSelector,
    draggable
  }
})
export default class ArtworkPage extends FormPageComponent {
  artwork!: Artwork
  previewImage!: ArtworkImageFile
  cachedArtwork!: Artwork
  editMode = false
  zoom = false
  isZoomDragging: boolean = false
  zoomLeft: number = 0
  zoomTop: number = 0
  zoomMouseDownX: number = 0
  zoomMouseDownY: number = 0

  async asyncData({ $axios, store, params }: Context) {
    try {
      const { payload } = await $axios.$get(`/api/artwork/${params.id}`)

      if (!payload.city) {
        payload.city = null
      }

      return {
        artwork: payload,
        previewImage: payload.images[0]
      }
    } catch (error) {
      ToastService.error(`error fetching artwork or app config: ${error}`)
    }
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
    for (let i = 0; i < this.$store.state.config.cities.length; i++) {
      if (this.$store.state.config.cities[i].id === this.artwork.city) {
        return this.$store.state.config.cities[i].name
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

  getImageSource(image: ArtworkImageFile) {
    if (isImageFileRef(image)) {
      return `/artwork-images/${(<ImageFileRef>image).source}`
    }

    if (isImageUploadPreview(image)) {
      return `data:${image.type};base64, ${image.ascii}`
    }

    return ''
  }

  setPreviewImage(image: ArtworkImageFile) {
    if (!this.editMode) {
      this.previewImage = image
    }
  }

  @debounce
  onPreviewArtworkClicked() {
    this.zoom = !this.zoom
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
    this.artwork = Object.assign({}, this.artwork, this.cachedArtwork)
    this.toggleEditMode(false)
  }

  @debounce
  onCloseZoomDialog() {
    this.zoom = false
  }

  onZoomDialogMouseDown(evt: MouseEvent) {
    evt.preventDefault()
    this.isZoomDragging = true
    this.zoomMouseDownX = evt.clientX
    this.zoomMouseDownY = evt.clientY
  }

  onZoomDialogMouseUp(evt: MouseEvent) {
    evt.preventDefault()
    this.isZoomDragging = false
  }

  onZoomDialogMouseMove(evt: MouseEvent) {
    if (this.isZoomDragging) {
      this.zoomLeft = evt.clientX - this.zoomMouseDownX
      this.zoomTop = evt.clientY - this.zoomMouseDownY
    }
  }

  @debounce
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

  @debounce
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

  @debounce
  async onDeleteArtworkImageClicked(index: number) {
    this.artwork.images.splice(index, 1)
  }

  @debounce
  async saveArtwork() {
    const artwork = await this.$artworkService.updateArtwork(this.artwork)

    if (artwork) {
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
        ToastService.success(`artwork updated`)
      }
    } catch (error) {
      ToastService.error(`error updating artwork`)
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
.artwork-image-selector {
  height: 56px;
  width: 96px;
  margin: 5px;
}
.artwork-actions {
  position: fixed;
  top: 40vh;
  left: 5px;
}
.artwork-zoom-image {
  position: relative;
  width: unset;
  display: block;
  margin-left: auto;
  margin-right: auto;
  cursor: grab;
}
.artwork-zoom-image.dragging {
  cursor: grabbing;
}

.v-dialog__content >>> .v-dialog {
  background: transparent;
  box-shadow: none !important;
  overflow: hidden;
}
</style>
