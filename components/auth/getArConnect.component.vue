<template>
  <v-dialog
    :value="zoom"
    @click:outside="onCloseDialog"
    max-width="300"
  >
    <v-card>
      <v-card-title>Arweave Wallet Required</v-card-title>
      <v-card-text>
        An <strong>Arweave wallet</strong> is required to log in
      </v-card-text>
      <v-card-actions>
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
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from 'nuxt-property-decorator'

@Component
export default class GetArConnect extends Vue {
  @PropSync('show', {
    type: Boolean,
    required: true,
    default: false
  }) zoom!: boolean

  onCloseDialog() {
    this.zoom = false
  }
}
</script>
