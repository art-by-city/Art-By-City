<template>
  <div class="model-input">
    <template v-if="model.url">
      <v-row dense>
        <v-col cols="12">
          <ModelViewer
            :url="model.url"
            :type="model.type"
            :disabled="disabled"
            ref="ModelViewer"
          />
        </v-col>
      </v-row>

      <v-row dense>
        <v-btn icon small @click="onDeleteModelClicked" :disabled="disabled">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-row>
    </template>

    <template v-else>
      <v-col cols="12" class="pa-0">
        <v-responsive
          class="model-input-container text-center"
          :class="{ 'has-error': !valid }"
        >
          <label
            class="model-upload-label"
            for="upload"
          >
            <v-icon :color="this.disabled ? 'gray' : 'black'">
              mdi-cube-scan
            </v-icon>
          </label>
          <input
            id="upload"
            class="model-upload-input"
            type="file"
            :accept="accept"
            @input="onModelChanged($event)"
            :disabled="disabled"
          />
        </v-responsive>
        <span v-if="!valid" class="red--text caption">
          A 3D asset file is required
        </span>
      </v-col>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Model, Prop, Vue } from 'nuxt-property-decorator'
import * as mime from 'mime-types'

import { debounce, uuidv4 } from '~/app/util'
import { ModelViewer } from '../artwork'
import { TrackableEntity, URLArtworkModel } from '~/app/core'

@Component({
  components: {
    ModelViewer
  }
})
export default class ModelInput extends Vue {
  readonly accept = '.glb, .gltf'

  @Model('input', {
    type: [Object],
    required: true
  }) model!: TrackableEntity & URLArtworkModel

  @Emit('input') onModelInputChanged(
    model: TrackableEntity & URLArtworkModel
  ): TrackableEntity & URLArtworkModel {
    return model
  }

  @Emit('file') onModelFileChanged(file: File): File {
    return file
  }

  @Emit('delete') onModelFileDeleted() {}

  @Prop({
    type: Boolean,
    required: false,
    default: true
  }) readonly valid!: boolean

  @Prop({
    type: Boolean,
    required: false,
    default: true
  }) readonly disabled!: boolean

  @debounce
  async onDeleteModelClicked() {
    this.onModelInputChanged({
      guid: uuidv4(),
      url: '',
      type: ''
    })
    this.onModelFileDeleted()
  }

  async generatePreviewImage() {
    try {
      const modelViewerComponent = this.$refs['ModelViewer'] as ModelViewer
      return await modelViewerComponent.generatePreviewImage()
    } catch (err) {
      console.error(err)
      return null
    }
  }

  async onModelChanged(event: InputEvent) {
    if (event.target) {
      const target = event.target as HTMLInputElement
      if (target.files && target.files[0]) {
        const file = target.files[0]
        const type = mime.lookup(file.name) || ''
        this.onModelInputChanged({
          guid: uuidv4(),
          url: URL.createObjectURL(file),
          type
        })
        this.onModelFileChanged(file)
      }
    }
  }
}
</script>

<style scoped>
.model-input {
  width: 100%;
}
.model-upload-label {
  cursor: pointer;
  height: 28px;
  width: 28px;
  display: inline-flex;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.model-upload-input {
  display: none;
}
.model-input-container {
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
