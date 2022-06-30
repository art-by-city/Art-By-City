<template>
  <v-footer class="app-footer" color="white" padless app>
    <v-container class="text-lowercase text-center">
      <v-row dense justify="center" no-gutters>
        <v-col cols="12" md="4" class="text-caption">
          &copy; {{ new Date().getFullYear() }} art x by x city
        </v-col>
        <v-col cols="12" md="4">
          <nuxt-link class="black--text mr-2" to="/">Home</nuxt-link>
          <nuxt-link class="black--text mr-2" to="/discover">Discover</nuxt-link>
          <nuxt-link class="black--text mr-2" to="/about">About</nuxt-link>
          <nuxt-link class="black--text mr-2" to="/faq">FAQ</nuxt-link>
          <nuxt-link class="black--text mr-2" to="/create">
            Create an Arweave Wallet
          </nuxt-link>
        </v-col>
        <v-col cols="12" md="4">
          <v-btn
           href="https://gitlab.com/art-by-city"
           target="_blank"
           icon
           x-small
          >
            <v-icon>mdi-gitlab</v-icon>
          </v-btn>
          <v-btn
           href="https://github.com/art-by-city"
           target="_blank"
           icon
           x-small
          >
            <v-icon>mdi-github</v-icon>
          </v-btn>
          <v-btn
           href="https://twitter.com/artbycity"
           target="_blank"
           icon
           x-small
          >
            <v-icon>mdi-twitter</v-icon>
          </v-btn>
          <v-btn
           href="https://discord.gg/w4Yhc95b8p"
           target="_blank"
           icon
           x-small
          >
            <v-icon>mdi-discord</v-icon>
          </v-btn>
          <v-btn
           href="https://twitch.tv/artbycity"
           target="_blank"
           icon
           x-small
          >
            <v-icon>mdi-twitch</v-icon>
          </v-btn>
          <v-btn
           href="https://www.youtube.com/channel/UCpmfXlmQYt1Hq4dl4S5yhpQ"
           target="_blank"
           icon
           x-small
          >
            <v-icon>mdi-youtube</v-icon>
          </v-btn>
          <v-btn
           href="https://www.linkedin.com/company/art-by-city"
           target="_blank"
           icon
           x-small
          >
            <v-icon>mdi-linkedin</v-icon>
          </v-btn>
          <v-btn
           href="https://bitclout.com/u/artbycity"
           target="_blank"
           text
           x-small
           tile
          >
            DeSo
          </v-btn>
          <v-btn
           href="https://minds.com/artbycity"
           target="_blank"
           text
           x-small
           tile
          >
            Minds
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class Footer extends Vue {}
</script>

<style scoped>
.app-footer {
  z-index: 5;
}
</style>
