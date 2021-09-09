<template>
  <v-card tile outlined height="250">
    <v-card-title>Log In with Arweave Wallet</v-card-title>
    <v-card-text>
      <p>
        An <strong>Arweave Wallet</strong> is required to log in<br />
      </p>
    </v-card-text>
    <v-container fluid>
      <template v-if="isArweaveWalletInstalled">
        <v-row justify="center">
          <v-btn
            elevation="2"
            outlined
            class="mx-auto"
            @click="onLoginClicked"
          >
            <v-img
              src="logo/arweave/arweave_logo.svg"
              max-height="20px"
              max-width="20px"
              contain
            ></v-img>
            <span class="mx-2">Log In</span>
          </v-btn>
        </v-row>
      </template>
      <template v-else>
        <v-row
          v-for="(provider, i) in walletProviders"
          :key="i"
          justify="center"
          class="my-1"
        >
          <v-btn
            :href="provider.url"
            target="_blank"
            elevation="2"
            outlined
            class="mx-auto"
          >
            <v-img
              :src="provider.logo"
              max-height="20px"
              max-width="20px"
              contain
            ></v-img>
            <span class="mx-2">Get {{ provider.name }}</span>
            <v-icon dense>mdi-open-in-new</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'nuxt-property-decorator'

import { debounce } from '~/helpers'

@Component
export default class GetArweaveWallet extends Vue {
  walletProviders = [
    {
      org: 'Koii',
      name: 'Finnie',
      url: 'https://koii.network/getFinnie',
      logo: 'logo/koii/Koii_Logo_blue.png'
    },
    {
      org: 'th8ta',
      name: 'ArConnect',
      url: 'https://arconnect.io',
      logo: 'logo/arconnect/logo64.png'
    }
  ]

  get isArweaveWalletInstalled() {
    return window && window.arweaveWallet ? true : false
  }

  @debounce
  @Emit('login') onLoginClicked() {}
}
</script>
