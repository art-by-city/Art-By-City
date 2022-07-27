<template>
  <v-container class="threeD-edit-form">
    <v-form
      ref="form"
      v-model="valid"
      autocomplete="off"
      :disabled="isUploading || isSigned"
    >
      <v-row dense justify="center" align="center">
        <canvas
          id="threeDCanvas"
          :class="{ 'hidden': !artwork.model.url }"
        ></canvas>
        <template v-if="artwork.model.url">
          <v-btn icon small @click="onDelete3dClicked">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <template v-else>
          <v-col cols="6">
            <v-responsive
              class="threeD-input-container text-center"
              :class="{ 'has-error': has3dValidationErrors }"
            >
              <label
                class="threeD-upload-label"
                for="upload"
              >
                <v-icon>mdi-cube-scan</v-icon>
              </label>
              <input
                id="upload"
                class="threeD-upload-input"
                type="file"
                :accept="accept"
                @input="on3dChanged($event)"
              />
            </v-responsive>
            <span v-if="has3dValidationErrors" class="red--text caption">
              A 3D asset file is required
            </span>
          </v-col>
        </template>
      </v-row>

      <v-row dense justify="center">
        <v-col cols="12">
          <v-text-field
            v-model="artwork.title"
            type="text"
            name="artworkTitle"
            label="Title"
            counter="128"
            @input="generateSlugFromTitle"
            :rules="[rules.required, rules.maxLength(128)]"
          ></v-text-field>

          <v-text-field
            v-model="artwork.slug"
            type="text"
            name="artworkSlug"
            counter="128"
            :label="slugBase"
            :rules="[rules.required, rules.maxLength(128), rules.slug]"
          ></v-text-field>

          <v-text-field
            v-model="artwork.created"
            name="artworkCreated"
            label="Created (Year)"
            placeholder="2022"
            :rules="[rules.year]"
          ></v-text-field>

          <!-- <v-text-field
            v-model="artwork.city"
            name="artworkCity"
            label="City Code"
            placeholder="NYC"
            :rules="[rules.city]"
          ></v-text-field> -->

          <v-textarea
            v-model="artwork.description"
            name="artworkDescription"
            label="Description"
            hint="Enter a description for this 3D Asset"
            auto-grow
            rows="2"
            counter="1024"
            :rules="[rules.maxLength(1024)]"
          ></v-textarea>

          <!-- <LicenseSelector v-model="artwork.license" /> -->
        </v-col>
      </v-row>

      <v-row dense justify="center">
        <TransactionFormControls
          :loading="isUploading"
          :signed="isSigned"
          :txTotal="txTotal"
          :txSize="txSize"
          :info="info"
          :pct="uploadPct"
          @sign="onSign"
          @cancel="onCancel"
          @submit="onSubmit"
        />
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import * as pc from 'playcanvas'

import { PublishingForm } from '~/components/publishing'
import { debounce, uuidv4 } from '~/app/util'
import {
  ImageInput,
  LicenseSelector,
  TransactionFormControls
} from '~/components/forms'

@Component({
  components: {
    ImageInput,
    LicenseSelector,
    TransactionFormControls
  }
})
export default class ThreeDEditForm extends PublishingForm {
  readonly accept = 'model/*'

  pc!: pc.Application
  canvas!: HTMLCanvasElement

  // TODO -> type & default values
  artwork: any = {
    model: {
      url: null
    }
  }

  rules = {
    required: (value: string = '') => value.length < 1 ? 'Required' : true,
    minLength: (minLength: number) => (value: string = '') => {
      if (!value) {
        return true
      }
      return value.length < minLength
        ? `Minimum 3 characters`
        : true
    },
    maxLength: (maxLength: number) => (value: string = '') => {
      return value.length > maxLength
        ? `Maximum ${maxLength} characters`
        : true
    },
    city: (value: string = '') => {
      if (!value) {
        return true
      }

      const validCityCodeRegex = /^[a-zA-Z]{3}$/

      if (!validCityCodeRegex.test(value)) {
        return 'Must be a valid city code'
      }

      return true
    },
    year: (value: string = '') => {
      if (!value) {
        return true
      }

      const year = Number.parseInt(value)

      if (
        Number.isNaN(year)
        || year > (new Date()).getFullYear()
        || year < 1000
      ) {
        return 'Must be a valid year'
      }

      return true
    },
    slug: (value: string = '') => {
      const validSlugRegex = /^[a-z0-9]+(?:[-_\.]*[a-z0-9]+)*$/

      if (!validSlugRegex.test(value)) {
        return 'Must be a valid URL slug'
          + ' (lowerchase alphanumerics, hyphen, underscore, period),'
          + ' must not end with a hyphen, underscore, or period'
      }

      return true
    }
  }

  get has3dValidationErrors(): boolean {
    return this.dirty && !this.artwork.model.url
  }

  mounted() {
    this.canvas = document.getElementById('threeDCanvas') as HTMLCanvasElement

    console.log('got canvas', this.canvas)
  }

  async on3dChanged(event: InputEvent) {
    if (event.target) {
      const target = event.target as HTMLInputElement
      if (target.files && target.files[0]) {
        const file = target.files[0]
        await this.suggestMetadataFromFile(file)
        await this.loadAsset(file)
      }
    }
  }

  async loadAsset(file: File) {
    const url = URL.createObjectURL(file)

    if (!this.pc) {
      this.pc = new pc.Application(this.canvas)
    }

    // TODO -> unload previous asset from playcanvas

    // NB: from https://github.com/playcanvas/engine/blob/main/examples/src/examples/loaders/glb.tsx
    let camerasComponents: Array<pc.CameraComponent> = []
    this.pc.assets.loadFromUrlAndFilename(url, file.name, 'model', (err, asset) => {
      if (asset && !err) {
        this.pc.start()

        console.log('got asset', asset)
        console.log('got resource', asset.resource)

        const model = asset.resource as pc.Model

        // create an instance using render component
        // const entity = asset.resource.instantiateModelEntity() as pc.Entity
        this.pc.root.addChild(model.getGraph())
        // this.pc.root.addChild(model.get)

        // find all cameras - by default they are disabled
        // set their aspect ratio to automatic to work with any window size
        if (model.cameras.length < 1) {
          model.setCameras([{
            nearClip: 1,
            farClip: 100,
            fov: 55
          }])
        }
        camerasComponents = model.cameras as pc.CameraComponent[]
        camerasComponents.forEach((component) => {
          console.log('camera component', component)
          component.aspectRatioMode = pc.ASPECT_AUTO
        })

        // enable all lights from the glb
        if (model.lights.length < 1) {
          model.setLights([{
            type: "omni",
            color: new pc.Color(1, 1, 1),
            range: 10
          }])
        }
        const lightComponents: Array<pc.LightComponent>
          = model.lights as pc.LightComponent[]
        lightComponents.forEach((component) => {
          component.enabled = true
        })

        let time = 0
        let activeCamera = 0
        this.pc.on('update', function (dt) {
          time -= dt

          // change the camera every few seconds
          if (time <= 0) {
            time = 2

            // disable current camera
            if (camerasComponents[activeCamera]) {
              camerasComponents[activeCamera].enabled = false
            }

            // activate next camera
            activeCamera = (activeCamera + 1) % camerasComponents.length

            if (camerasComponents[activeCamera]) {
              camerasComponents[activeCamera].enabled = true
            }
          }
        })

        this.artwork.model = {
          guid: uuidv4(),
          type: file.type,
          url
        }
      } else {
        console.error('Error', err || 'missing asset')
      }
    })
  }

  @debounce
  async onDelete3dClicked() {
    // TODO -> unload asset from playcanvas
    this.artwork.model = { guid: uuidv4(), url: '', type: '' }
  }

  async onSign() {}

  async onSubmit() {}
}
</script>

<style scoped>
.threeD-upload-label {
  cursor: pointer;
  height: 28px;
  width: 28px;
  display: inline-flex;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.threeD-upload-input {
  display: none;
}
.threeD-input-container {
  border: 1px dashed black;
  height: 72px;
  /* width: 100%; */
}
.has-error {
  border: 1px solid red;
}
.hidden {
  display: none;
}
</style>
