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
          @touchmove="onImgTouchMove"
          @mousedown="onImgMouseDown"
          @touchstart="onImgTouchStart"
          @mouseup="onImgMouseUp"
          @touchend="onImgTouchEnd"
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
      <v-container class="artwork-zoom-controls">
        <v-row justify="center" @click="onCloseZoomDialog">
          <v-col cols="1" offset="2" md="1" offset-md="6">
            <v-btn icon @click="onCloseZoomDialog">
              <v-icon dark color="white">mdi-close-circle</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="auto" offset="1" md="2" offset-md="3" style="text-align: right;">
            <v-btn icon @click.stop="onZoomButtonClicked(-0.1)">
              <v-icon color="white">mdi-magnify-minus</v-icon>
            </v-btn>
            <v-btn icon @click.stop="onZoomButtonClicked(0.1)">
              <v-icon color="white">mdi-magnify-plus</v-icon>
            </v-btn>
            <span @click.stop class="white--text">
              {{ Math.round((zoomFactor+1)*100) }}%
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'nuxt-property-decorator'

import { debounce } from '~/helpers/helpers'

const ZOOM_UPPER_LIMIT: number = 4.1
const ZOOM_LOWER_LIMIT: number = -0.9

@Component
export default class ArtworkZoomDialog extends Vue {
  isDragging: boolean = false
  _width: number | 'auto' = 'auto'
  width: number | 'auto' = 'auto'
  height: number | 'auto' = 'auto'
  _height: number | 'auto' = 'auto'
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

  private reset() {
    this.left = 0
    this.top = 0
    this.offsetX = 0
    this.offsetY = 0
    this.mouseDownX = 0
    this.mouseDownY = 0
    this.width = this._width
    this.height = this._height
    this.zoomFactor = 0
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

  private handleDrag(x: number, y: number) {
    const diffX = x - this.mouseDownX
    const diffY = y - this.mouseDownY
    this.left = this.offsetX + diffX
    this.top = this.offsetY + diffY
  }

  @debounce
  onCloseZoomDialog() {
    this.zoom = false
    this.isDragging = false
    this.reset()
  }

  onImgTouchStart(evt: TouchEvent) {
    evt.preventDefault()
    this.startDragging(evt.touches[0].clientX, evt.touches[0].clientY)
  }
  onImgMouseDown(evt: MouseEvent) {
    evt.preventDefault()
    this.startDragging(evt.clientX, evt.clientY)
  }

  onImgTouchMove(evt: TouchEvent) {
    if (this.isDragging) {
      this.handleDrag(evt.touches[0].clientX, evt.touches[0].clientY)
    }
  }
  onImgMouseMove(evt: MouseEvent) {
    if (this.isDragging) {
      this.handleDrag(evt.clientX, evt.clientY)
    }
  }

  onImgTouchEnd(evt: TouchEvent) {
    evt.preventDefault()
    this.stopDragging()
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

  @debounce
  onZoomButtonClicked(factor: number) {
    this.magnify(factor)
  }

  onMouseWheel(evt: WheelEvent) {
    this.magnify(evt.deltaY / 1000)
  }

  private setImageDimensions() {
    if (this.$refs.zoomImage) {
      this._width = (<Element>this.$refs.zoomImage).clientWidth
      this.width = this._width
      this._height = (<Element>this.$refs.zoomImage).clientHeight
      this.height = this._height
    }
  }

  get zoomImageStyle() {
    if (
      this.width === 'auto'
      || this.height === 'auto') {
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
  height: 90vh;
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
  height: 90vh;
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
  padding-top: 0px;
}
</style>
