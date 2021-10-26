<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="6">
        <!-- <v-file-input
          accept="image/*"
          prepend-icon="mdi-camera-plus"
          @change="onFileChanged"
        ></v-file-input> -->
        <ImageFileInput v-model="images" />
      </v-col>
      <v-col cols="6">
        <v-btn @click="postToArweave">post</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Arweave from 'arweave'

import { debounce, dataUrlToArrayBuffer } from '~/helpers'
import { ArtworkImage } from '~/types'
import ProgressService from '~/services/progress/service'

const APP_NAME = 'ArtByCity-DEV'

type ArweaveDataType = string | Uint8Array | ArrayBuffer | undefined
type FileUploadRequest = {
  data: ArrayBuffer//string//ArrayBuffer//ArweaveDataType
  type: string
}

@Component({
  middleware: 'env/dev'
})
export default class DebugPage extends Vue {
  request!: FileUploadRequest
  images: ArtworkImage[] = []

  @debounce
  async onFileChanged(file: File) {
    if (file) {
      try {
        this.request = await this.readFile(file)
      } catch (error) {
        console.log('ERROR READING FILE', error)
      }
    }
  }

  async readFile(file: File): Promise<FileUploadRequest> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = async (error) => {
        reject(error)
      }
      reader.onload = async (evt) => {
        if (!evt.target || !evt.target.result) {
          reject('Error reading file')
          return
        }

        resolve({
          data: evt.target.result as ArrayBuffer,
          type: file.type
        })
      }
      reader.readAsArrayBuffer(file)
    })
  }

  async postToArweave() {
    // if (!this.request) {
    //   this.$toastService.error('add a file first')
    //   return
    // }
    // const data = this.request.data
    // const type = this.request.type
    const data = dataUrlToArrayBuffer(this.images[0].dataUrl)
    const type = this.images[0].imageType
    try {
      ProgressService.start()
      const arweave = new Arweave(this.$config.arweave.apiConfig)

      const tx = await arweave.createTransaction({ data })
      tx.addTag('App-Name', APP_NAME)
      tx.addTag('Content-Type', type)
      await arweave.transactions.sign(tx)
      await arweave.transactions.post(tx)

      const txMsg = ['DebugPage.postToArweave() posted tx id', tx.id]
      console.log(...txMsg)
      this.$toastService.success(txMsg.join(' '))

      const res = await arweave.api.get(tx.id)
      console.log('DebugPage.postToArweave() res', res)
    } catch (error) {
      console.error('error in postToArweave()', error)
    } finally {
      ProgressService.stop()
    }
  }
}
</script>
