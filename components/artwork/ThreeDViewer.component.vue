<template>
  <div class="threeD-viewer">
    <canvas
      id="threeDCanvas"
      :class="{ 'hidden': !url }"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import * as pc from 'playcanvas'
import * as mime from 'mime-types'

import { URLArtworkImage } from '~/app/core'

@Component
export default class ThreeDViewer extends Vue {
  private pc?: pc.Application

  @Prop({
    type: String,
    required: true
  }) url!: string

  @Prop({
    type: String,
    required: true
  }) type!: string

  @Prop({
    type: Boolean,
    required: false,
    default: true
  }) readonly disabled!: boolean

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly editable!: boolean

  mounted() {
    this.resetPlayCanvas()
    this.loadAsset()
  }

  destroyed() {
    this.resetPlayCanvas()
  }

  async generatePreviewImage(): Promise<URLArtworkImage> {
      const type = 'image/png'

      try {
        const url = await new Promise<string>((resolve, reject) => {
          this.pc?.graphicsDevice.canvas.getContext(
            'webgl',
            { preserveDrawingBuffer: true }
          )
          this.pc?.graphicsDevice.canvas.toBlob(blob => {
            if (blob) {
              resolve(URL.createObjectURL(blob))
            } else {
              reject('Error generating image preview')
            }
          }, type)
        })

        return { url, type }
      } catch (err) {
        console.error(err)
        return { url: '', type: '' }
      }
  }

  private resetPlayCanvas() {
    this.pc?.destroy()
    delete this.pc
  }

  private async loadAsset() {
    switch (this.type) {
      case 'model/gltf-binary':
        this.loadGlb()
        break
      case 'model/gltf+json':
        this.loadGlb()
        break
      default:
        console.error('Error: unsupported asset type')
    }
  }

  private async loadGlb() {
    const extension = mime.extension(this.type)
    const canvas = document.getElementById('threeDCanvas') as HTMLCanvasElement
    this.pc = new pc.Application(canvas, {
      graphicsDeviceOptions: {
        // NB: Blurry unless enabled, might be perf hit on older mobile devices
        maxPixelRatio: 1,

        // NB: Necessary to generate preview assets, may impact performance
        preserveDrawingBuffer: true
      }
    })
    this.pc.setCanvasResolution(pc.RESOLUTION_FIXED, 1920, 1080)

    this.pc.assets.loadFromUrlAndFilename(
      this.url,
      `asset.${extension}`,
      'container',
      (err, asset) => {
        if (this.pc && asset && !err) {
          const entity =
            (asset.resource as pc.ContainerResource).instantiateRenderEntity()
          this.pc.root.addChild(entity)

          const camera = new pc.Entity('camera')
          camera.addComponent('camera', {
            clearColor: new pc.Color(1, 1, 1)
          })
          this.pc.root.addChild(camera)
          camera.setPosition(0, 0, 50)

          const light = new pc.Entity('light')
          light.addComponent('light')
          this.pc.root.addChild(light)
          light.setEulerAngles(45, 0, 0)

          const mouse = new pc.Mouse(document.body)
          let x = 0
          let y = 0
          mouse.on(pc.EVENT_MOUSEMOVE, (event: pc.MouseEvent) => {
            if (this.disabled) {
              return
            }

            event.event.preventDefault()
            if (event.buttons[pc.MOUSEBUTTON_LEFT]) {
              x += event.dx
              y += event.dy
              entity.setLocalEulerAngles(0.2 * y, 0.2 * x, 0)
            }
          })
          mouse.on('mousewheel', function (event: pc.MouseEvent) {
            const eventTarget = event.event.target as Element
            if (eventTarget && eventTarget.id === 'threeDCanvas') {
              event.event.preventDefault()
              camera.translate(0, 0, event.wheelDelta * 10)
            }
          })

          const keyboard = new pc.Keyboard(document.body)
          keyboard.on('keydown', e => {
            e.event.preventDefault()
          })
          this.pc.on('update', (dt: number) => {
            if (keyboard.isPressed(pc.KEY_LEFT)) {
              camera.translate(1, 0, 0)
            }
            if (keyboard.isPressed(pc.KEY_RIGHT)) {
              camera.translate(-1, 0, 0)
            }
            if (keyboard.isPressed(pc.KEY_UP)) {
              camera.translate(0, -1, 0)
            }
            if (keyboard.isPressed(pc.KEY_DOWN)) {
              camera.translate(0, 1, 0)
            }
          })

          this.pc.start()
        } else {
          console.error('Error', err || 'missing asset')
        }
      }
    )
  }
}
</script>

<style scoped>
#threeDCanvas {
  width: 100%;
  border: 1px solid black;
  cursor: grab;
}
#threeDCanvas:active {
  cursor: grabbing;
}
</style>
