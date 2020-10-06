<template>
  <v-dialog
    v-if="image"
    :value="zoom"
    persistent
    height="500px"
    width="500px"
  >
    <div
      class="artwork-zoom-dialog-container"
      @mouseout="onContainerMouseOut"
    >
      <img
        class="artwork-zoom-image"
        :class="{ 'dragging': isDragging }"
        :src="getImageSource(image)"
        :style="`left: ${left}px; top: ${top}px`"
        contain
        @mousemove="onImgMouseMove"
        @mousedown="onImgMouseDown"
        @mouseup="onImgMouseUp"
      />
      <div
        @mousemove="onImgMouseMove"
        @mousedown="onImgMouseDown"
        @mouseup="onImgMouseUp"
        class="thumbnail-bounds"
      ></div>
    </div>
    <v-btn @click="onSaveClicked">OK</v-btn>
    <v-btn @click="onCancelClicked">CANCEL</v-btn>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync, Emit } from 'nuxt-property-decorator'

import { debounce } from '~/helpers/helpers'
import {
  ArtworkImageFile,
  getImageSource,
  isFile
} from '~/models/artwork/artwork'

@Component
export default class ArtworkThumbnailDialog extends Vue {
  getImageSource = getImageSource
  isDragging: boolean = false
  left: number = 0
  top: number = 0
  offsetX: number = 0
  offsetY: number = 0
  mouseDownX: number = 0
  mouseDownY: number = 0

  @PropSync('show', {
    type: Boolean,
    required: true,
    default: false
  }) zoom!: boolean

  @Prop({
    default: null
  }) image!: ArtworkImageFile | null

  private reset() {
    this.left = 0
    this.top = 0
    this.offsetX = 0
    this.offsetY = 0
    this.mouseDownX = 0
    this.mouseDownY = 0
  }

  private startDragging(x: number, y: number) {
    this.isDragging = true
    this.offsetX = this.left
    this.offsetY = this.top
    this.mouseDownX = x
    this.mouseDownY = y
  }

  private stopDragging() {
    this.isDragging = false
  }

  @debounce
  onCloseZoomDialog() {
    this.zoom = false
    this.reset()
  }

  onImgMouseDown(evt: MouseEvent) {
    evt.preventDefault()
    this.startDragging(evt.clientX, evt.clientY)
  }

  onImgMouseMove(evt: MouseEvent) {
    if (this.isDragging) {
      const diffX = evt.clientX - this.mouseDownX
      const diffY = evt.clientY - this.mouseDownY
      this.left = this.offsetX + diffX
      this.top = this.offsetY + diffY
    }
  }

  onImgMouseUp(evt: MouseEvent) {
    evt.preventDefault()
    this.stopDragging()
  }

  onContainerMouseOut(evt: MouseEvent) {
    evt.preventDefault()
    if (this.isDragging) {
      const tarClass = (<Element>evt.relatedTarget)?.className
      const shouldContinue = tarClass.includes('thumbnail-bounds')
        || tarClass.includes('artwork-zoom-image')
      if (!shouldContinue) {
        this.stopDragging()
      }
    }
  }

  @Emit('close') onArtworkThumbnailDialogClosed(save: boolean = false) {
    if (save && this.image && !isFile(this.image)) {
      this.image.thumbX = this.left
      this.image.thumbY = this.top

      this.onCloseZoomDialog()

      return this.image
    }

    this.onCloseZoomDialog()
  }

  @debounce
  onSaveClicked() {
    this.onArtworkThumbnailDialogClosed(true)
  }

  @debounce
  onCancelClicked() {
    this.onArtworkThumbnailDialogClosed(false)
  }
}
</script>

<style scoped>
.artwork-zoom-dialog-container {
  background-color: rgba(0,0,0,0.5)
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

.thumbnail-bounds {
  border: 1px solid red;
  width: 33.3333333333vh;
  height: 33.3333333333vh;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
</style>
