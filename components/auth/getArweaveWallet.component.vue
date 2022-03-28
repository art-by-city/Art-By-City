<template>
  <v-card tile outlined>
    <v-card-title>{{ title }}</v-card-title>
    <v-container fluid>
      <template v-if="isArweaveWalletInstalled">
        <v-row justify="center" class="mb-2">
          <v-btn
            elevation="2"
            outlined
            class="mx-auto mb-2"
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
        <v-row justify="center" class="mb-2">
          <v-btn
            elevation="2"
            outlined
            class="mx-auto"
            @click="onCreateWalletClicked"
          >
            <span class="mx-2">Create Wallet</span>
          </v-btn>
        </v-row>
      </template>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'nuxt-property-decorator'

import { debounce } from '~/app/util'
import WalletProvidersList from './walletProvidersList.component.vue'

@Component({
  components: {
    WalletProvidersList
  }
})
export default class GetArweaveWallet extends Vue {
  get isArweaveWalletInstalled() {
    return window && window.arweaveWallet ? true : false
  }

  get title() {
    return this.isArweaveWalletInstalled
      ? 'Log In with Arweave Wallet'
      : 'Create an Arweave Wallet'
  }

  @debounce
  @Emit('login') onLoginClicked() {}

  @debounce
  @Emit('create') onCreateWalletClicked() {}
}
</script>
