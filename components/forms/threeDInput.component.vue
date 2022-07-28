<template>
  <div class="threeD-input">
    <template v-if="model.url">
      <ThreeDViewer
        :url="model.url"
        :type="model.type"
        :disabled="disabled"
      />

      <v-btn icon small @click="onDelete3dClicked" :disabled="disabled">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>

    <template v-else>
      <v-col cols="12">
        <v-responsive
          class="threeD-input-container text-center"
          :class="{ 'has-error': !valid }"
        >
          <label
            class="threeD-upload-label"
            for="upload"
          >
            <v-icon :color="this.disabled ? 'gray' : 'black'">
              mdi-cube-scan
            </v-icon>
          </label>
          <input
            id="upload"
            class="threeD-upload-input"
            type="file"
            :accept="accept"
            @input="on3dChanged($event)"
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
import ThreeDViewer from '../artwork/ThreeDViewer.component.vue'

@Component({
  components: {
    ThreeDViewer
  }
})
export default class ThreeDInput extends Vue {
  readonly accept = 'model/*' // TODO -> restrict to supported formats

  @Model('input', {
    type: [Object],
    required: true
  }) model!: any // TODO -> type

  // TODO -> arg & return types
  @Emit('input') onThreeDInputChanged(model: any): any {
    console.log('ThreeDInput.onThreeDInputChanged() model.type', model.type)
    return model
  }

  @Emit('file') onThreeDFileChanged(file: File): File {
    return file
  }

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
  async onDelete3dClicked() {
    this.onThreeDInputChanged({
      guid: uuidv4(),
      url: '',
      type: ''
    })
  }

  async on3dChanged(event: InputEvent) {
    if (event.target) {
      const target = event.target as HTMLInputElement
      if (target.files && target.files[0]) {
        const file = target.files[0]
        const type = mime.lookup(file.name)
        this.onThreeDInputChanged({
          guid: uuidv4(),
          url: URL.createObjectURL(file),
          type
        })
        this.onThreeDFileChanged(file)
      }
    }
  }
}
</script>

<style scoped>
.threeD-input {
  width: 100%;
}
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
