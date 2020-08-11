<template>
  <v-container fluid style="width: 100%;">
    <v-row justify="center">
      <v-col cols="auto">
        <h1 class="text-lowercase">About art x by x city</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto">
        <p>
          Welcome to the Alpha Phase of <strong>art x by city</strong>.
        </p>
        <p>More should be written here!</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'

import PageComponent from '~/components/pages/page.component'

@Component
export default class AboutPage extends PageComponent {

}
</script>
