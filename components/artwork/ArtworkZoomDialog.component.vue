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
          @wheel="onMouseWheel"
        >
        </div>
        <img
          class="artwork-zoom-image"
          ref="zoomImage"
          :class="{ 'dragging': isDragging }"
          :src="src"
          :style="zoomImageStyle"
        />
      </div>
      <div class="artwork-zoom-controls">
        <v-btn icon @click="onZoomButtonClicked(-0.1)">
          <v-icon color="white">mdi-magnify-minus</v-icon>
        </v-btn>
        <v-btn icon @click="onZoomButtonClicked(0.1)">
          <v-icon color="white">mdi-magnify-plus</v-icon>
        </v-btn>
        <span class="white--text">{{ Math.round((zoomFactor+1)*100) }}%</span>
      </div>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'nuxt-property-decorator'

import { debounce } from '~/helpers/helpers'

const ZOOM_UPPER_LIMIT: number = 1
const ZOOM_LOWER_LIMIT: number = -1

@Component
export default class ArtworkZoomDialog extends Vue {
  isDragging: boolean = false
  width: number | 'auto' = 'auto'
  height: number | 'auto' = 'auto'
  left: number = 0
  top: number = 0
  offsetX: number = 0
  offsetY: number = 0
  mouseDownX: number = 0
  mouseDownY: number = 0
  zoomFactor: number = 0

  @PropSync('show', {
    type: Boolean,
    required: true,
    default: false
  }) zoom!: boolean

  @Prop({
    type: String,
    required: true
  }) readonly src!: string

  private setImageDimensions() {
    if (this.$refs.zoomImage) {
      this.width = (<Element>this.$refs.zoomImage).clientWidth
      this.height = (<Element>this.$refs.zoomImage).clientHeight
    }
  }

  private reset() {
    this.left = 0
    this.top = 0
    this.offsetX = 0
    this.offsetY = 0
    this.mouseDownX = 0
    this.mouseDownY = 0
    delete this.width
    delete this.height
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

  private magnify(factor: number) {
    const newZoomFactor = this.zoomFactor + factor
    if (
      newZoomFactor <= ZOOM_UPPER_LIMIT
      && newZoomFactor >= ZOOM_LOWER_LIMIT
    ) {
      this.zoomFactor = newZoomFactor
    }
  }

  onZoomButtonClicked(factor: number) {
    this.magnify(factor)
  }

  onMouseWheel(evt: WheelEvent) {
    this.magnify(evt.deltaY / 1000)
  }

  get zoomImageStyle() {
    if (this.width === 'auto' || this.height === 'auto') {
      this.setImageDimensions()
    }

    const left = `${this.left}px`
    const top = `${this.top}px`

    const scale = 1 + this.zoomFactor

    const width = this.width === 'auto'
      ? this.width
      : `${this.width * scale}px`
    const height = this.height === 'auto'
      ? this.height
      : `${this.height * scale}px`

    return { left, top, width, height }
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
  height: 95vh;
  width: 95vw;
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

.artwork-zoom-controls {
  z-index: 9993;
  position: absolute;
  top: 95vh;
  left: 90vw;
  cursor: pointer;
}
</style>
