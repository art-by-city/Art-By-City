<template>
  <v-container justify="center">
    <v-row justify="center">
      <v-col cols="auto">
        <span class="text-h2">Create an Arweave Wallet</span>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto" sm="6">
        <v-stepper v-model="step" vertical flat non-linear>

          <!-- Generate Keyfile -->
          <v-stepper-step step="1" editable>
            Generate Keyfile
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-sheet flat tile class="pt-1">
              <p>
                Generate and download an Arweave Wallet Keyfile by clicking the
                button below.
              </p>
              <v-btn
                elevation="2"
                outlined
                class="mx-auto mb-2"
                @click="onDownloadKeyfileClicked"
              >
                <span class="mx-2">Download Arweave Keyfile</span>
                <v-icon dense>mdi-file-download</v-icon>
              </v-btn>
            </v-sheet>
          </v-stepper-content>

          <!-- Install Wallet Extension -->
          <v-stepper-step step="2" editable>
            Install Wallet Extension
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-sheet flat tile class="pt-1">
              <p>
                Grab a Wallet Extension from one of the providers below.  We'll
                be adding support for more wallets in the future!
              </p>
              <p>
                Note: you may need to refresh the browser to enable the
                extension after installation.
              </p>
              <WalletProvidersList />
            </v-sheet>
          </v-stepper-content>

          <!-- Import Keyfile into Wallet Extension -->
          <v-stepper-step step="3" editable>
            Install Keyfile into Wallet Extension
          </v-stepper-step>
          <v-stepper-content step="3">
            <v-sheet flat tile class="pt-1">
              <p>
                Once the Wallet Extension installed, import the keyfile you
                downloaded in step 1 by following the extension's import Keyfile
                instructions.
              </p>
              <p>
                Once imported, you can click on <strong>Log In</strong>
                above to get started!
              </p>
            </v-sheet>
          </v-stepper-content>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { debounce } from '~/app/util'
import { WalletProvidersList } from '~/components'

@Component({
  components: {
    WalletProvidersList
  }
})
export default class CreateWalletPage extends Vue {
  get head() {
    return { title: 'Create an Arweave Wallet' }
  }

  step: number = 1

  @debounce
  async onDownloadKeyfileClicked() {
    const jwk = await this.$arweave.wallets.generate()
    const address = await this.$arweave.wallets.jwkToAddress(jwk)
    const keyfile = new Blob(
      [JSON.stringify(jwk)],
      { type: 'application/json' }
    )
    const keyfileUrl = URL.createObjectURL(keyfile)
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', keyfileUrl)
    downloadAnchor.setAttribute('download', `arweave-key-${address}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    document.body.removeChild(downloadAnchor)
  }
}
</script>
