<template>
  <v-footer
    class="app-footer"
    color="white"
    padless
    app
    :absolute="!fixed"
  >
    <v-container class="text-lowercase text-center pa-1 pa-md-2 pa-lg-3">
      <v-row dense justify="center" no-gutters>
        <v-col cols="4" md="3" lg="3" offset="4" offset-md="0" class="text-caption">
          &copy; {{ new Date().getFullYear() }} art x by x city
        </v-col>
        <v-col cols="1" offset="3" class="d-md-none">
          <v-btn icon x-small @click="toggleExpanded">
            <v-icon>
              mdi-chevron-double-{{ expanded ? 'down' : 'up' }}
            </v-icon>
          </v-btn>
        </v-col>
        <v-col
          cols="12" md="5" lg="6"
          class="d-md-flex" :class="{ 'd-none': !expanded }"
        >
          <nuxt-link class="black--text mr-2" to="/">Home</nuxt-link>
          <nuxt-link class="black--text mr-2" to="/discover">Discover</nuxt-link>
          <nuxt-link class="black--text mr-2" to="/about">About</nuxt-link>
          <nuxt-link class="black--text mr-2" to="/faq">FAQ</nuxt-link>
          <nuxt-link class="black--text mr-2" to="/wallet">
            Create Wallet
          </nuxt-link>
        </v-col>
        <v-col
          cols="12" md="4" lg="3"
          class="d-md-flex" :class="{ 'd-none': !expanded }"
        >
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
           x-small
           plain
           elevation="0"
           color="white"
           class="pa-0"
          >
            <v-img
              width="16px"
              height="16px"
              contain
              src="/logo/discord/Discord-Logo-Black.svg"
            ></v-img>
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
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { debounce } from '~/app/util'

@Component
export default class Footer extends Vue {
  expanded: boolean = false

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) fixed!: boolean

  @debounce
  toggleExpanded() {
    this.expanded = !this.expanded
  }
}
</script>

<style scoped>
.app-footer {
  z-index: 5;
}
</style>
