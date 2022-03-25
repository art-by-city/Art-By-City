<template>
  <v-container fluid style="width: 100%;">
    <v-row justify="center">
      <v-col cols="12" class="text-h2" style="text-align: center;">
        <strong>Art By City Alpha</strong>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="6">
        <p>
          <strong>Art By City</strong>
          is currently in <strong>Alpha Testing</strong>.  This dapp is our
          submission to the 5th run of the
          <a
            href="https://owf.dev"
            target="_blank"
            style="text-decoration-none"
          >
            Open Web Foundry
            <v-icon small dense style="margin-top: -4px;">
              mdi-open-in-new
            </v-icon>
          </a> hackathon.
        </p>
        <p>
          You may experience bugs or errors, so please bear with us as we
          work to build <strong>The Artist's Permaweb</strong>.  Please
          feel free to help us test the app, and provide us with feedback!
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class AboutPage extends Vue {}
</script>
