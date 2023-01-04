<template>
  <v-dialog
    :value="open"
    persistent
    width="600"
  >
    <v-container dense class="pa-1">
      <v-row dense>
        <v-col dense cols="12" class="pa-0">
          <v-card :loading="$fetchState.pending">
            <v-card-title>Edit Identity</v-card-title>
            <v-card-subtitle>
              <a
                href="https://ark.decent.land/#faq"
                target="_blank"
                class="grey--text decentdotland-anchor"
              >
                <img
                  class="decentdotland-logo"
                  src="/logo/decentdotland/logo25.png"
                />
                Ark Protocol
              </a>
            </v-card-subtitle>
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
                    <th></th>
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
                        :loading="isUploading"
                        @click="onSetPrimaryIdentityClicked(network, address)"
                      >Set Primary</v-btn>
                    </td>
                    <td>
                      <v-btn
                        outlined
                        x-small
                        elevation="2"
                        :loading="isUploading"
                        @click="onUnlinkIdentityClicked(address)"
                      >Unlink</v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>

              <span v-else-if="!$fetchState.pending">
                No identities linked!
              </span>

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
                  :items="contractKeysAndLabels"
                  item-text="label"
                  item-value="key"
                  label="Network"
                  outlined
                  dense
                  @input="onNetworkSelected(network)"
                ></v-select>

                <template v-if="foreignAddress">
                  <v-text-field
                    label="Address"
                    outlined
                    dense
                    disabled
                    v-model="foreignAddress"
                  ></v-text-field>
                  <v-btn
                    name="linkIdentity"
                    outlined
                    elevation="2"
                    color="black"
                    small
                    :loading="isUploading"
                    :disabled="isAlreadyConnected"
                    @click="onLinkIdentityClicked(network)"
                  >Link</v-btn>
                  <span v-if="isAlreadyConnected">
                    Address already connected!
                  </span>
                </template>
                <template v-else-if="network">
                  <v-btn
                    name="connect"
                    outlined
                    elevation="2"
                    color="black"
                    small
                    :loading="isUploading"
                    :disabled="!network"
                    @click="onConnectIdentityClicked"
                  >Connect</v-btn>
                </template>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-container>
                <v-row justify="center">
                  <v-btn
                    outlined
                    elevation="2"
                    color="error"
                    :disabled="isUploading"
                    @click="onCancel"
                  >
                    Close
                  </v-btn>
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
import { Component, Watch } from 'nuxt-property-decorator'

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
  prevNetwork: string | null = null
  foreignAddress: string = ''
  isAlreadyConnected: boolean = false

  @Watch('open') async onOpen(open: boolean) {
    if (open) {
      this.$fetch()
    }
  }

  get contractKeysAndLabels() {
    return this.$ark
      ? this.$ark.contractKeysAndLabels
      : []
  }

  async fetch() {
    this.identities = await this.$ark.resolve(this.$auth.user.address)
  }

  private reset() {
    this.network = null
    this.prevNetwork = null
    this.foreignAddress = ''
    this.isAlreadyConnected = false
  }

  private updateIdentitiesFromState(state: any) {
    const ids: any[] = state.identities
    const id = ids.find(i => i.public_key === this.$auth.user.publicKey)
    this.identities = id ? id : null
  }

  private updateIsAlreadyConnected() {
    const checkIsAlreadyConnected = () => {
      if (this.identities) {
        const matchCurrentNetworkAndAddress = ({ address }: {
          address: string
        }) => {
          return address && address.toUpperCase() === this.foreignAddress.toUpperCase()
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

    this.isAlreadyConnected = checkIsAlreadyConnected()
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

          // NB: cache prev network on successful change
          this.prevNetwork = network
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
        this.network = this.prevNetwork
        console.error(error)
      }
    }
  }

  @debounce
  async onNetworkSelected(network: ArkNetworkKey) {
    this.isUploading = true
    this.foreignAddress = ''

    if (ArkNetworks[network].exmKey === 'EVM') {
      await this.switchEthereumChain(network)
    }
    this.isUploading = false
  }

  @debounce
  async onConnectIdentityClicked() {
    if (window.ethereum.request) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      }) as string[]
      this.foreignAddress = accounts[0] || ''
      this.updateIsAlreadyConnected()
    }
  }

  @debounce
  async onLinkIdentityClicked(network: ArkNetworkKey) {
    this.isUploading = true

    try {
      const state = await this.$ark.linkIdentity(
        network,
        this.$auth.user.address
      )

      this.updateIdentitiesFromState(state)
      this.reset()
    } catch (error) {
      console.error(error)
    }

    this.isUploading = false
  }

  @debounce
  async onUnlinkIdentityClicked(address: string) {
    this.isUploading = true

    try {
      const state = await this.$ark.unlinkIdentity(address)

      this.updateIdentitiesFromState(state)
      this.reset()
    } catch (error) {
      console.error(error)
    }

    this.isUploading = false
  }

  @debounce
  async onSetPrimaryIdentityClicked(address: string) {
    this.isUploading = true

    try {
      const state = await this.$ark.setPrimaryAddress(address)

      this.updateIdentitiesFromState(state)
      this.reset()
    } catch (error) {
      console.error(error)
    }

    this.isUploading = false
  }

  @debounce
  async onSign() {}
}
</script>

<style scoped>
.text-align-center {
  text-align: center;
}
.decentdotland-anchor {
  display: flex;
  align-items: center;
}
.decentdotland-logo {
  height: 25px;
  width: 25px;
  margin-right: 5px;
}
</style>
