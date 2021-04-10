<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4">
        <v-card flat outlined>
          <v-card-title>Authentication Test</v-card-title>
          <v-card-text>
            <ul v-if="accounts">
              <li v-for="(account, i) in accounts">{{ account }}</li>
            </ul>
            <span v-else>please authenticate</span>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="authClicked">
              Auth
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import Web3Modal from 'web3modal'

import FormPageComponent from '~/components/pages/formPage.component'
import { debounce } from '~/helpers/helpers'

@Component({
  middleware: 'role/admin',
  layout: 'admin',
  components: {}
})
export default class AdminWeb3SandboxPage extends FormPageComponent {
  accounts: null | string[] = null

  @debounce
  async authClicked() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true
    })
    const provider = await web3Modal.connect();
    const web3 = this.$web3(provider)
    this.accounts = await web3.eth.requestAccounts()

    // console.log('authClicked', window.ethereum)
    // const eth = this.$eth(window.ethereum)
    // this.accounts = await eth.eth.requestAccounts()
  }
}
</script>
