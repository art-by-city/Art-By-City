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

  mounted() {
    this.resetPlayCanvas()
    this.loadAsset()
  }

  destroyed() {
    this.resetPlayCanvas()
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
      case 'model/obj':
        this.loadObj()
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
        maxPixelRatio: 1
      }
    })
    this.pc.setCanvasResolution(pc.RESOLUTION_FIXED, 1920, 1080)
    // NB: from https://github.com/playcanvas/engine/blob/main/examples/src/examples/loaders/glb.tsx
    let camerasComponents: Array<pc.CameraComponent> = []
    this.pc.assets.loadFromUrlAndFilename(
      this.url,
      `asset.${extension}`,
      'container',
      (err, asset) => {
        if (this.pc && asset && !err) {
          // create an instance using render component
          const entity = asset.resource.instantiateModelEntity() as pc.Entity
          this.pc.root.addChild(entity)

          // const box = new pc.Entity('cube')
          // box.addComponent('render', { type: 'box' })
          // box.addComponent('model', {
          //   asset,
          //   type: 'asset'
          // })
          // this.pc.root.addChild(box)

          // find all cameras - by default they are disabled
          // set their aspect ratio to automatic to work with any window size
          // if (model.cameras.length < 1) {
          //   model.setCameras([{
          //     nearClip: 1,
          //     farClip: 100,
          //     fov: 55
          //   }])
          // }
          // camerasComponents = model.cameras as pc.CameraComponent[]
          // camerasComponents.forEach((component) => {
          //   console.log('camera component', component)
          //   component.aspectRatioMode = pc.ASPECT_AUTO
          // })

          const camera = new pc.Entity('camera')
          camera.addComponent('camera', {
            clearColor: new pc.Color(0.5, 0.6, 0.9)
          })
          this.pc.root.addChild(camera)
          camera.setPosition(0, 0, 100)

          // enable all lights from the glb
          // if (model.lights.length < 1) {
          //   model.setLights([{
          //     type: "omni",
          //     color: new pc.Color(1, 1, 1),
          //     range: 10
          //   }])
          // }
          // const lightComponents: Array<pc.LightComponent>
          //   = model.lights as pc.LightComponent[]
          // lightComponents.forEach((component) => {
          //   component.enabled = true
          // })

          const light = new pc.Entity('light')
          light.addComponent('light')
          this.pc.root.addChild(light)
          light.setEulerAngles(45, 0, 0)

          // this.pc.on('update', function (dt: number) {
          //   box.rotate(10 * dt, 20 * dt, 30 * dt)
          //   entity.rotate(0, 20 * dt, 0)
          // })

          const mouse = new pc.Mouse(document.body)
          let x = 0
          const y = 0
          // mouse.on(pc.EVENT_MOUSEDOWN, (event: pc.MouseEvent) => {})
          mouse.on(pc.EVENT_MOUSEMOVE, (event: pc.MouseEvent) => {
            if (this.disabled) {
              return
            }
            // event.event.preventDefault()
            if (event.buttons[pc.MOUSEBUTTON_LEFT]) {
              x += event.dx
              entity.setLocalEulerAngles(0.2 * y, 0.2 * x, 0)
            }
          })
          // mouse.on('mousewheel', function (event: pc.MouseEvent) {
          //   event.event.preventDefault()
          //   camera.translate(0, 0, event.wheelDelta * 10)
          // })

          const keyboard = new pc.Keyboard(document.body)
          this.pc.on('update', function (dt: number) {
            if (keyboard.isPressed(pc.KEY_LEFT)) {
              // entity.rotate(0, -1, 0)
              camera.translate(1, 0, 0)
            }
            if (keyboard.isPressed(pc.KEY_RIGHT)) {
              // entity.rotate(0, 1, 0)
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

  private async loadObj() {
    // TODO
  }
}
</script>

<style scoped>
#threeDCanvas {
  width: 100%;
}
</style>
