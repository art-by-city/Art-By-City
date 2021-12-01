<template>
  <v-container fluid style="width: 100%;">
    <v-row justify="center">
      <v-col cols="12" style="text-align: center;">
        <SplashLogo />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto">
        <p>check back later for more details.</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'

import PageComponent from '~/components/pages/page.component'

@Component
export default class AboutPage extends PageComponent {}
</script>
