<template>
  <div class="model-viewer">
    <canvas
      id="modelCanvas"
      :class="{ 'hidden': !url }"
      width="75vw"
      height="75vh"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import * as pc from 'playcanvas'
import * as mime from 'mime-types'

import { URLArtworkImage } from '~/app/core'

@Component
export default class ModelViewer extends Vue {
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
    default: false
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
    const canvas = document.getElementById('modelCanvas') as HTMLCanvasElement
    this.pc = new pc.Application(canvas, {
      graphicsDeviceOptions: {
        // NB: Blurry unless enabled, might be perf hit on older mobile devices
        maxPixelRatio: 1,

        // NB: Necessary to generate preview assets, may impact performance
        preserveDrawingBuffer: true
      },
      keyboard: new pc.Keyboard(canvas),
      mouse: new pc.Mouse(canvas),
      touch: new pc.TouchDevice(canvas)
    })
    this.pc.setCanvasResolution(pc.RESOLUTION_FIXED, 1920, 1080)

    const assets = {
      userAsset: new pc.Asset('userAsset', 'container', {
        url: this.url,
        filename: `userAsset.${extension}`
      }),
      orbitCameraScript: new pc.Asset('orbitCameraScript', 'script', {
        url: '/scripts/playcanvas/orbit-camera.js'
      })
    }


    window.pc = pc
    new pc.AssetListLoader(Object.values(assets), this.pc.assets).load(
      (err: Error, failed: any[]) => {
        if (this.pc && !err) {
          const entity =
            assets.userAsset.resource.instantiateRenderEntity() as pc.Entity
          this.pc.root.addChild(entity)

          // console.log('got userAsset', assets.userAsset)
          // console.log('got userAsset.resource', assets.userAsset.resource)
          // console.log('got container render entity', entity)

          // Cameras
          const camera = new pc.Entity('camera')
          camera.addComponent('camera', {
            clearColor: new pc.Color(1, 1, 1)
          })
          camera.addComponent('script')
          camera.script!.create('orbitCamera', {
            attributes: {
              focusEntity: entity
            }
          }) as pc.ScriptType
          camera.script!.create('orbitCameraInputMouse')
          camera.script!.create('orbitCameraInputTouch')
          this.pc.root.addChild(camera)

          // Lights
          const lights = entity.findComponents('light') as pc.LightComponent[]
          if (lights.length > 0) {
            lights.forEach(light => {
              light.enabled = true
            })
          } else {
            const light = new pc.Entity('light')
            light.addComponent('light', { type: 'directional' })
            this.pc.root.addChild(light)
            light.setLocalEulerAngles(45, 30, 0)
          }

          // Animations
          if (assets.userAsset.resource.animations.length > 0) {
            entity.addComponent('anim', { activate: true })
            entity.anim!.assignAnimation(
              '1',
              assets.userAsset.resource.animations[0].resource
            )
            entity.anim!.baseLayer.transition('1')
          }

          this.pc.start()
        } else {
          console.error('Error', err || 'missing asset', failed)
        }
      }
    )
  }
}
</script>

<style scoped>
.model-viewer {
  width: 100%;
  height: 100%;
}
#modelCanvas {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  max-height: 100%;
  border: 1px solid black;
  cursor: grab;
}
#modelCanvas:active {
  cursor: grabbing;
}
</style>
