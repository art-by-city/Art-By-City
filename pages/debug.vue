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
import { Component } from 'nuxt-property-decorator'
import Arweave from 'arweave'
import { Bundle, bundleAndSignData, createData, DataItem } from 'arbundles'

import { debounce } from '~/helpers'
import FormPageComponent from '../components/pages/formPage.component'
import ProgressService from '~/services/progress/service'
import { Artwork } from '../types'
import { ArweaveSigner, Signer } from 'arbundles/src/signing'
import { SignatureConfig, SIG_CONFIG } from 'arbundles/src/constants'
import TestweaveJWK from '../../testweave-keyfile.json'
import { getSignatureData } from 'arbundles/src/ar-data-base'
import { PermissionType } from 'arconnect'

const APP_NAME = 'ArtByCity-DEV'

type ArweaveDataType = string | Uint8Array | ArrayBuffer | undefined
type FileUploadRequest = {
  data: ArrayBuffer//string//ArrayBuffer//ArweaveDataType
  type: string
}

@Component({
  middleware: 'env/dev'
})
export default class DebugPage extends FormPageComponent {
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
        if (!evt.target || !evt.target.result) {
          reject('Error reading file')
          return
        }

        resolve({
          data: evt.target.result as ArrayBuffer,
          // data: evt.target.result as string,
          type: file.type
        })
      }
      reader.readAsArrayBuffer(file)
      // reader.readAsBinaryString(file)
    })
  }

  async postToArweave() {
    if (!this.request) {
      this.$toastService.error('add a file first')
      return
    }
    ProgressService.start()
    try {
      class ArweaveWalletSigner implements Signer {
        signatureType: number = SignatureConfig.ARWEAVE
        ownerLength: number = SIG_CONFIG[SignatureConfig.ARWEAVE].pubLength
        signatureLength: number = SIG_CONFIG[SignatureConfig.ARWEAVE].sigLength

        // TODO
        publicKey: Buffer

        // TODO ?
        pem?: string | Buffer | undefined

        constructor(publicKey: Buffer) {
          this.publicKey = publicKey
        }

        async sign(message: Uint8Array): Promise<Uint8Array> {
          const signature = await window.arweaveWallet.signature(message, {
            name: "RSA-PSS",
            saltLength: 32,
          }) as any

          const signatureArray = []
          const keys = Object.keys(signature)

          for (let i = 0; i < keys.length; i++) {
            signatureArray.push(signature[keys[i]])
          }

          return Uint8Array.from(signatureArray)
        }

        static async verify(
          pk: string,
          message: Uint8Array,
          signature: Uint8Array,
        ): Promise<boolean> {
          return await Arweave.crypto.verify(pk, message, signature)
        }
      }
      async function getSignatureAndId(
        item: DataItem,
        signer: Signer,
      ): Promise<{ signature: Buffer; id: Buffer }> {
        const signatureData = await getSignatureData(item);

        const signatureBytes = await signer.sign(signatureData);
        const idBytes = await Arweave.crypto.hash(signatureBytes);

        return { signature: Buffer.from(signatureBytes), id: Buffer.from(idBytes) };
        // return { signature: signatureBytes, id: Buffer.from(idBytes) }
      }
      async function sign(item: DataItem, signer: Signer): Promise<Buffer> {
        const { signature, id } = await getSignatureAndId(item, signer);
        console.log('SIGN FUNCTION signature, id', signature.toString(), id.toString())
        item.getRaw().set(signature, 2);
        return id;
      }
      function longTo32ByteArray(long: number): Uint8Array {
        // we want to represent the input as a 8-bytes array
        const byteArray = [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
        ];

        for (let index = 0; index < byteArray.length; index++) {
          const byte = long & 0xff;
          byteArray[index] = byte;
          long = (long - byte) / 256;
        }

        return Buffer.from(byteArray);
      }

      async function makeJWKSigner(): Promise<Signer> {
        const jwk = require('../../arweave-keyfile-MlV6DeOtRmakDOf6vgOBlif795tcWimgyPsYYNQ8q1Y.json')
        return new ArweaveSigner(jwk)
      }

      async function makeWalletSigner(): Promise<Signer> {
        const publicKey = await window.arweaveWallet.getActivePublicKey()
        const publicKeyBuffer = Buffer.from(publicKey, 'base64')
        return new ArweaveWalletSigner(publicKeyBuffer)
      }

      const makeBinaryBundle = async () => {
        const signer = await makeWalletSigner()

        const imageData = this.request.data
        const imageUint8 = new Uint8Array(imageData)

        const data1 = createData(imageUint8, signer, {
          tags: [ { name: 'Content-Type', value: this.request.type } ]
        })
        console.log('data1 id pre-sign', data1.id)
        const rawId1 = await data1.sign(signer)
        console.log('created data1', data1.id, data1.isSigned())//, Arweave.utils.b64UrlDecode(rawId1.toString()))

        const manifest = {
          creator: { address: this.$auth.user.address },
          title: 'Debug Image',
          images: [`ar://${data1.id}`]
        }
        const data2 = createData(JSON.stringify(manifest), signer, {
          tags: [ { name: 'Content-Type', value: 'application/json' } ]
        })
        console.log('created data2', data2.id, data2.isSigned())

        const dataItems = [ data1, data2 ]

        const headers = Buffer.alloc(64 * dataItems.length);

        const binaries = await Promise.all(
          dataItems.map(async (d, index) => {
            // Sign DataItem
            const id = d.isSigned() ? d.rawId : await sign(d, signer);
            // Create header array
            const header = Buffer.alloc(64);
            // Set offset
            header.set(longTo32ByteArray(d.getRaw().byteLength), 0);
            // Set id
            header.set(id, 32);
            // Add header to array of headers
            headers.set(header, 64 * index);
            // Convert to array for flattening
            return d.getRaw();
          }),
        ).then((a) => {
          return Buffer.concat(a);
        });

        const buffer = Buffer.concat([
          longTo32ByteArray(dataItems.length),
          headers,
          binaries,
        ]);

        const bundle = new Bundle(buffer)
        console.log('bundle items ', bundle.items)
        console.log('bundle tx 1 id', bundle.get(0).id)
        console.log('bundle tx 2 id', bundle.get(1).id)

        const tx = await this.$arweave.createTransaction({ data: bundle.getRaw() })
        tx.addTag('Bundle-Format', 'binary')
        tx.addTag('Bundle-Version', '2.0.0')

        console.log('created tx', tx.id)

        // await this.$arweave.transactions.sign(tx, jwk)
        await this.$arweave.transactions.sign(tx)
        console.log('BUNDLE TX ID', tx.id)
        const result = await this.$arweave.transactions.post(tx)
        console.log('BUNDLE POST RESULT', result)
      }

      const makeJsonBundle = async () => {
        const imageData = this.request.data
        const imageUint8 = new Uint8Array(imageData)

        const publicKey = await window.arweaveWallet.getActivePublicKey()

        const data1 = {
          owner: publicKey,
          target: '',
          nonce: '',
          tags: [
            {
              name: Arweave.utils.stringToB64Url('Content-Type'),
              value: Arweave.utils.stringToB64Url(this.request.type)
            }
          ],
          data: 'TODO',
          signature: 'TODO',
          id: 'TODO'
        }

        const dataItems = { items: [ data1 ] }
        const data = JSON.stringify(dataItems)
        const tx = await this.$arweave.createTransaction({ data })
        console.log('created tx')

        // TODO -> Extend TokenableSchemeOptions and add these
        const APP_INFO = {
          name: 'Art x By x City',
          logo: 'logo/logo_by_daliah_ammar_square.png'
        }

        // TODO -> Extend TokenableSchemeOptions and add these
        const APP_PERMISSIONS = [
          'ACCESS_ADDRESS',
          'ACCESS_PUBLIC_KEY',
          'SIGNATURE',
          'SIGN_TRANSACTION'
        ]
        console.log('CONNECTING')
        await window.arweaveWallet.connect(
          APP_PERMISSIONS as PermissionType[],
          APP_INFO
        )
        console.log('CONNECTED')
        await this.$arweave.transactions.sign(tx)
        console.log('got bundle tx id', tx.id)
        const result = await this.$arweave.transactions.post(tx)
        console.log('got bundle tx post result', result)
      }

      // await makeJsonBundle()
      await makeBinaryBundle()
    } catch (error) {
      console.error('error in postToArweave()', error)
    } finally {
      ProgressService.stop()
    }
  }
}
</script>
