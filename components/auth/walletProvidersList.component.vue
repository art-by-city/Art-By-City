<template>
  <div>
    <v-row
      v-for="(provider, i) in walletProviders"
      :key="i"
      class="my-1"
    >
      <v-btn
        :href="provider.url"
        target="_blank"
        elevation="2"
        outlined
        class="mx-4"
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class WalletProvidersList extends Vue {
  walletProviders = [
    // {
    //   org: 'Koii',
    //   name: 'Finnie',
    //   url: 'https://koii.network/getFinnie',
    //   logo: 'logo/koii/Koii_Logo_blue.png'
    // },
    {
      org: 'th8ta',
      name: 'ArConnect',
      url: 'https://arconnect.io',
      logo: 'logo/arconnect/logo64.png'
    }
  ]
}
</script>
