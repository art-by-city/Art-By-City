<template>
  <div class="artwork-zoom-dialog">
    <v-dialog
      v-model="zoom"
      @click:outside="onCloseZoomDialog"
      fullscreen
    >
      <div
        class="artwork-zoom-dialog-container"
        @mouseout.prevent="onContainerMouseOut"
      >
        <div
          class="artwork-zoom-image-overlay"
          @mousemove.prevent="onImgMouseMove"
          @touchmove.prevent="onImgTouchMove"
          @mousedown.prevent="onImgMouseDown"
          @touchstart.prevent="onImgTouchStart"
          @mouseup.prevent="onImgMouseUp"
          @touchend.prevent="onImgTouchEnd"
          @wheel.prevent="onMouseWheel"
        >
        </div>
        <img
          class="artwork-zoom-image"
          ref="image"
          :class="{ 'dragging': isDragging }"
          :src="image.src"
          :style="zoomImageStyle"
        />

        <div id="artwork-zoom-close" class="ma-12">
          <v-btn
            fab
            dark
            color="black"
            x-small
            @click="onCloseZoomDialog"
          >
            <v-icon dark color="white">mdi-close-circle</v-icon>
          </v-btn>
        </div>

        <div id="artwork-zoom-controls" class="mb-10">
          <v-btn
            fab
            dark
            color="black"
            x-small
            @click.stop="onZoomButtonClicked(-0.1)"
          >
            <v-icon dark color="white">mdi-magnify-minus</v-icon>
          </v-btn>
          <v-btn
            fab
            dark
            color="black"
            x-small
            @click.stop="onZoomButtonClicked(0.1)"
          >
            <v-icon dark color="white">mdi-magnify-plus</v-icon>
          </v-btn>
          <span
            id="artwork-zoom-percent"
            class="black white--text rounded-pill"
          >
            {{ Math.round((zoomFactor+1)*100) }}%
          </span>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync, Watch } from 'nuxt-property-decorator'

import { debounce } from '~/helpers'

const ZOOM_UPPER_LIMIT: number = 4.1
const ZOOM_LOWER_LIMIT: number = -0.9

@Component
export default class ArtworkZoomDialog extends Vue {
  isDragging: boolean = false
  left: number = 0
  top: number = 0
  offsetX: number = 0
  offsetY: number = 0
  mouseDownX: number = 0
  mouseDownY: number = 0
  zoomFactor: number = 0

  image: {
    width: number
    height: number
    src: string
  } = {
    width: 0,
    height: 0,
    src: ''
  }

  @PropSync('show', {
    type: Boolean,
    required: true,
    default: false
  }) zoom!: boolean

  @Watch('zoom')
  onDialogOpenedOrClosed() {
    this.reset()
  }

  @Prop({
    type: String,
    required: true
  }) readonly src!: string

  @Watch('src')
  onLoadImage() {
    const image = new Image()

    image.onload = () => {
      this.image.src = image.src
      this.image.width = image.width
      this.image.height = image.height
    }

    image.src = this.src
  }

  mounted() {
    this.onLoadImage()
  }

  private reset() {
    this.isDragging = false
    this.left = 0
    this.top = 0
    this.offsetX = 0
    this.offsetY = 0
    this.mouseDownX = 0
    this.mouseDownY = 0
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
    this.stopDragging()
  }
  onImgMouseUp(evt: MouseEvent) {
    this.stopDragging()
  }

  onContainerMouseOut(evt: MouseEvent) {
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

  get zoomImageStyle() {
    const scale = 1 + this.zoomFactor

    const left = (this.left - Math.floor(this.image.width / 2)) / scale
    const top = (this.top - Math.floor(this.image.height / 2)) / scale

    return { transform: `scale(${scale}) translate(${left}px, ${top}px)` }
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
  height: 100%;
  width: 100%;
}

.artwork-zoom-image {
  z-index: 9991;
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: unset;
  display: block;
  margin-left: auto;
  margin-right: auto;
  cursor: grab;

  /* noselect */
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and FF */
}

.artwork-zoom-image-overlay {
  float: left;
  z-index: 9992;
  position: absolute;
  width: 100%;
  height: 100%;
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

#artwork-zoom-controls {
  z-index: 9993;
  position: fixed;
  bottom: 0;
  left: 50%;
  margin-left: -60px;
}

#artwork-zoom-close {
  z-index: 9993;
  position: fixed;
  top: 0;
}

#artwork-zoom-percent {
  padding: 6px !important;
}
</style>
