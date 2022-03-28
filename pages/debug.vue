<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="6">
        <v-file-input
          accept="image/*"
          prepend-icon="mdi-camera-plus"
          @change="onFileChanged"
        ></v-file-input>
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
import ArdbTransaction from 'ardb/lib/models/transaction'

import { debounce } from '~/app/util'

const APP_NAME = 'ArtByCity-DEV'

type ArweaveDataType = string | Uint8Array | ArrayBuffer | undefined
type FileUploadRequest = {
  data: ArweaveDataType
  type: string
}

@Component({
  middleware: 'env/dev'
})
export default class DebugPage extends Vue {
  request!: FileUploadRequest

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
        if (!evt.target) {
          reject('Error reading file')
          return
        }

        resolve({
          data: reader.result?.toString() || '',
          type: file.type
        })
      }
      // reader.readAsDataURL(file)
      reader.readAsArrayBuffer(file)
    })
  }

  async postToArweave() {
    // if (!this.request) {
    //   this.$toasts.error('add a file first')
    //   return
    // }
    try {
      this.$nuxt.$loading.start()
      // // rq5F6F8dJt9HdpqjT9rb4okcGCfcErLfWeLNii5qwFw
      // const arweave = new Arweave(this.$config.arweave.api)

      // const tx = await arweave.createTransaction({ data: this.request.data })
      // tx.addTag('App-Name', APP_NAME)
      // tx.addTag('Content-Type', this.request.type)
      // await arweave.transactions.sign(tx)
      // await arweave.transactions.post(tx)

      // const txMsg = ['DebugPage.postToArweave() posted tx id', tx.id]
      // console.log(...txMsg)
      // this.$toasts.success(txMsg.join(' '))

      // const res = await arweave.api.get(tx.id)
      // console.log('DebugPage.postToArweave() res', res)

      // MlV6DeOtRmakDOf6vgOBlif795tcWimgyPsYYNQ8q1Y/glyph75bundled
      const owner = 'MlV6DeOtRmakDOf6vgOBlif795tcWimgyPsYYNQ8q1Y'
      const slug = 'glyph75bundled'

      let query = this.$ardb
      .search('transactions')
      .tag('App-Name', this.$config.arweave.app.name)
      .tag('App-Version', this.$config.arweave.app.version)
      // .type('application/json')
      // .tag('Bundle-Format', 'binary')
      // .tag('Category', 'avatar')
      // .tag('Category', 'artwork')
      .tag('slug', slug)
      // .from(owner)
      // .tag('Bundle-Format', 'binary')

      // tags.forEach(tag => console.log(window.atob(tag.name), window.atob(tag.value)))

      const txs = await query.find({ sort: 'HEIGHT_DESC' }) as ArdbTransaction[]
      const firstTxId = txs.length > 0 ? txs[0].id : ''
      console.log(this.$config.arweave.app.name, this.$config.arweave.app.version)
      console.log('fetch result', txs.length, firstTxId)
    } catch (error) {
      console.error('error in postToArweave()', error)
    } finally {
      this.$nuxt.$loading.finish()
    }
  }
}
</script>
