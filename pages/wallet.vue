<template>
  <v-container fluid>
    <v-row justify="center">
      <h2>Wallet</h2>
    </v-row>
    <v-row justify="center">
      <v-col cols="11" sm="6">
        <v-card>
          <v-card-title>Arweave</v-card-title>
          <v-card-text>{{ arweaveAddress }}</v-card-text>
          <v-card-actions>
            <v-btn
              v-if="arweaveAddress"
              color="error"
              @click="disconnectArweave"
            >
              Disconnect
            </v-btn>
            <v-btn
              v-else
              color="info"
              @click="connectArweave"
            >
              Connect
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'
import { debounce } from '~/helpers/helpers'

const APP_INFO = {
  name: 'Art x By x City',
  // TODO -> logo
}

@Component({
  middleware: 'auth'
})
export default class WalletPage extends FormPageComponent {
  arweaveAddress = ''

  mounted() {
    if (process.client) {
      window.addEventListener('arweaveWalletLoaded', this.onArweaveWalletLoaded)
      // window.addEventListener('walletSwitch', this.onArweaveWalletSwitched)
    }
  }

  destroyed() {
    if (process.client) {
      window.removeEventListener('arweaveWalletLoaded', this.onArweaveWalletLoaded)
      // window.removeEventListener('walletSwitch', this.onArweaveWalletSwitched)
    }
  }

  private async onArweaveWalletLoaded() {
    try {
      this.arweaveAddress = await window.arweaveWallet.getActiveAddress()
    } catch (e) {
      console.error(e)
    }
  }

  // private async onArweaveWalletSwitched(evt: any) {
  //   try {
  //     console.log('WalletPage.onArweaveWalletSwitched(evt)', evt)
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }

  @debounce
  async connectArweave() {
    try {
      await window.arweaveWallet.connect(['ACCESS_ADDRESS'], APP_INFO)
      this.arweaveAddress = await window.arweaveWallet.getActiveAddress()
    } catch (e) {
      console.error(e)
    }
  }

  @debounce
  async disconnectArweave() {
    try {
      await window.arweaveWallet.disconnect()
      this.arweaveAddress = ''
    } catch (e) {
      console.error(e)
    }

  }
}
</script>
