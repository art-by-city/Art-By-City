<template>
  <v-card tile outlined height="200">
    <v-card-title>Log In with Arweave Wallet</v-card-title>
    <v-card-text>
      <p>
        An <strong>Arweave Wallet</strong> is required to log in<br />
        Choose a wallet provider below
      </p>
    </v-card-text>
    <v-card-actions>
      <template v-if="isArConnectInstalled">
        <v-btn
          elevation="6"
          class="mx-auto"
          @click="onLoginClicked"
        >
          <v-img
            src="logo/arconnect/logo64.png"
            max-height="20px"
            max-width="20px"
            contain
          ></v-img>
          <span class="mx-2">ArConnect</span>
        </v-btn>
      </template>
      <template v-else>
        <v-btn
          href="https://arconnect.io"
          target="_blank"
          elevation="6"
          class="mx-auto"
        >
          <v-img
            src="logo/arconnect/logo64.png"
            max-height="20px"
            max-width="20px"
            contain
          ></v-img>
          <span class="mx-2">Get ArConnect</span>
          <v-icon dense>mdi-open-in-new</v-icon>
        </v-btn>
      </template>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'nuxt-property-decorator'

import { debounce } from '~/helpers'

@Component
export default class GetArConnect extends Vue {
  get isArConnectInstalled() {
    return window && window.arweaveWallet ? true : false
  }

  @debounce
  @Emit('login') onLoginClicked() {}
}
</script>
