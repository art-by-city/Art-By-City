<template>
  <div class="artwork-zoom-dialog">
    <v-dialog
      :value="zoom"
      @click:outside="onCloseZoomDialog"
      max-height="95vh"
      max-width="95vw"
    >
      <div
        class="artwork-zoom-dialog-container"
        @mouseout="onContainerMouseOut"
      >
        <div
          class="artwork-zoom-image-overlay"
          @mousemove="onImgMouseMove"
          @mousedown="onImgMouseDown"
          @mouseup="onImgMouseUp"
        >
        </div>
        <img
          class="artwork-zoom-image"
          :class="{ 'dragging': isDragging }"
          :src="src"
          :style="`left: ${left}px; top: ${top}px`"
        />
      </div>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'nuxt-property-decorator'

import { debounce } from '~/helpers/helpers'

@Component
export default class ArtworkZoomDialog extends Vue {
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
    type: String,
    required: true
  }) readonly src!: string

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
    this.stopDragging()
  }
}
</script>

<style scoped>
.artwork-zoom-dialog {
  z-index: 9990;
}

.artwork-zoom-dialog-container {
  background-color: rgba(0,0,0,0.5);
  text-align: center;
}

.artwork-zoom-image {
  z-index: 9991;
  display: inline-block;
  position: relative;
  width: unset;
  display: block;
  margin-left: auto;
  margin-right: auto;
  cursor: grab;
}

.artwork-zoom-image-overlay {
  float: left;
  z-index: 9992;
  position: absolute;
  width: 95vw;
  height: 95vh;
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
