<template>
  <v-dialog
    :value.sync="open"
    persistent
    width="600"
  >
    <v-container dense class="pa-1">
      <v-row dense>
        <v-col dense cols="12" class="pa-0">
          <v-card>
            <v-card-title>Identities</v-card-title>
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
              <v-simple-table dense>
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
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>

            <v-card-actions>
              <v-container>
                <v-row justify="center">
                  <v-btn
                    outlined
                    elevation="2"
                    color="error"
                    @click="close"
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
import { Component, Prop, PropSync, Vue } from 'nuxt-property-decorator'

import { ArkIdentity } from '~/plugins/ark'
import { debounce } from '~/app/util'

@Component
export default class IdentitiesDialog extends Vue {
  @Prop({
    type: Object,
    required: true
  }) readonly identities!: ArkIdentity

  @PropSync('show', {
    type: Boolean,
    required: false
  }) open?: boolean


  close() {
    this.open = false
  }
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