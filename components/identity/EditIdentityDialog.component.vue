<template>
  <v-dialog
    :value="open"
    persistent
    width="600"
  >
    <v-container dense class="pa-1">
      <v-row dense>
        <v-col dense cols="12" class="pa-0">
          <v-card>
            <v-card-title>Edit Identity</v-card-title>
            <v-divider></v-divider>
            <v-card-text>

              <v-simple-table
                dense
                v-if="identities && identities.addresses.length > 0"
              >
                <thead>
                  <tr>
                    <th>Network</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Primary</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="{
                      address,
                      network,
                      is_evaluated,
                      is_verified
                    } in identities.addresses"
                    :key="address"
                  >
                    <td>{{ $ark.networks[network].label }}</td>
                    <td class="text-truncate">
                      <BlockchainAddress :address="address" />
                    </td>
                    <td class="text-align-center">
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            {{
                              is_evaluated && is_verified
                                ? 'mdi-account-check'
                                : 'mdi-account-clock'
                            }}
                          </v-icon>
                        </template>
                        <span>
                          {{
                            is_evaluated && is_verified
                              ? 'Confirmed'
                              : 'Pending'
                          }}
                        </span>
                      </v-tooltip>
                    </td>
                    <td class="text-align-center">
                      <v-tooltip
                        top
                        v-if="address === identities.primary_address"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-account-star
                          </v-icon>
                        </template>
                        <span>Primary</span>
                      </v-tooltip>

                      <v-btn
                        v-else
                        outlined
                        x-small
                        elevation="2"
                        @click="onSetPrimaryIdentityClicked(network, address)"
                      >Set Primary</v-btn>
                    </td>
                    <td>
                      <v-btn
                        outlined
                        x-small
                        elevation="2"
                        @click="onUnlinkIdentityClicked(network, address)"
                      >Unlink</v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>

              <v-simple-table
                dense
                v-if="identities && identities.unevaluated_addresses.length > 0"
              >
                <thead>
                  <tr>
                    <th>Pending</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="{ address } in identities.unevaluated_addresses"
                    :key="address"
                    style="width: 100%"
                  >
                    <td class="text-truncate">{{ address }}</td>
                  </tr>
                </tbody>
              </v-simple-table>

              <v-divider></v-divider>

              <br />

              <v-form
                ref="form"
                v-model="valid"
                autocomplete="off"
                :disabled="isSigned"
              >
                <v-card-subtitle>Link Identity</v-card-subtitle>

                <v-select
                  v-model="network"
                  :items="$ark.contractKeysAndLabels"
                  item-text="label"
                  item-value="key"
                  label="Network"
                  outlined
                  dense
                  @input="onNetworkSelected(network)"
                >
                  <template v-slot:append-outer>
                    <v-btn
                      outlined
                      elevation="2"
                      color="black"
                      small
                      :disabled="!network"
                      @click="onConnectIdentityClicked"
                    >Connect</v-btn>
                  </template>
                </v-select>

                <template v-if="foreignAddress">
                  <v-text-field
                    outlined
                    dense
                    disabled
                    v-model="foreignAddress"
                  ></v-text-field>

                  <v-btn
                    name="linkIdentity"
                    v-if="foreignAddress"
                    outlined
                    elevation="2"
                    color="black"
                    small
                    :disabled="isAlreadyConnected"
                    @click="onLinkIdentityClicked(network)"
                  >Link</v-btn>
                </template>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-container>
                <v-row justify="center">
                  <TransactionFormControls
                    :loading="isUploading || isValidating"
                    :disabled="isValidating || !valid || !dirty"
                    :signed="isSigned"
                    :txTotal="txTotal"
                    isContract
                    @sign="onSign"
                    @cancel="onCancel"
                    @submit="onSubmit"
                  />
                </v-row>
              </v-container>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'

import { DomainEntityCategory } from '~/app/core'
import { debounce } from '~/app/util'
import { ArkIdentity, ArkNetworkKey, ArkNetworks } from '../../plugins/ark'
import TransactionDialog from '../common/TransactionDialog.component.vue'

@Component
export default class EditIdentityDialog extends TransactionDialog<string> {
  type: DomainEntityCategory = 'identity'
  valid = false
  dirty = false
  isValidating: boolean | string = false

  identities: ArkIdentity | null = null
  network: string | null = null
  foreignAddress: string = ''

  get isAlreadyConnected(): boolean {
    if (this.identities) {
      const matchCurrentNetworkAndAddress = ({ address, network }: {
        address: string,
        network: string
      }) => {
        return network === this.network
          && address.toUpperCase() === this.foreignAddress.toUpperCase()
      }

      const isAlreadyConfirmed = this.identities
        .addresses
        .some(matchCurrentNetworkAndAddress)

      const isAlreadyPending = this.identities
        .unevaluated_addresses
        .some(matchCurrentNetworkAndAddress)

      return isAlreadyConfirmed || isAlreadyPending
    }

    return false
  }

  fetchOnServer = false
  async fetch() {
    this.identities = await this.$ark.resolve(this.$auth.user.address)
  }

  private async switchEthereumChain(network: ArkNetworkKey) {
    try {
      if (window.ethereum.request) {
        const chainId = ArkNetworks[network].chainId
        if (chainId) {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId }]
          })
        }
      }
    } catch (error) {
      if (error.code === 4902) {
        // TODO -> try to add network to metamask
        // try {
        //   await ethereum.request({
        //     method: 'wallet_addEthereumChain',
        //     params: [
        //       {
        //         chainId: '0xf00',
        //         chainName: '...',
        //         rpcUrls: ['https://...'],
        //       },
        //     ],
        //   })
        // } catch (addError) {
        //   console.error(addError)
        // }
      } else {
        // TODO -> revert network on cancel
        console.error(error)
      }
    }
  }

  @debounce
  async onNetworkSelected(network: ArkNetworkKey) {
    this.foreignAddress = ''

    if (ArkNetworks[network].exmKey === 'EVM') {
      await this.switchEthereumChain(network)
    }
  }

  @debounce
  async onConnectIdentityClicked(network: ArkNetworkKey) {
    if (window.ethereum.request) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      }) as string[]
      this.foreignAddress = accounts[0] || ''
    }
  }

  @debounce
  async onLinkIdentityClicked(network: ArkNetworkKey) {
    try {
      const { foreignAddress, verificationReq } = await this.$ark.linkIdentity(
        network,
        this.$auth.user.address
      )

      console.log(
        `onLinkIdentityClicked(${network}) foreignAddress, verificationReq`,
        foreignAddress,
        verificationReq
      )
    } catch (error) {
      console.error(error)
    }
  }

  @debounce
  async onUnlinkIdentityClicked(network: string, address: string) {}

  @debounce
  async onSetPrimaryIdentityClicked(network: string, address: string) {}

  @debounce
  async onSign() {}
}
</script>

<style scoped>
.text-align-center {
  text-align: center;
}
</style>
