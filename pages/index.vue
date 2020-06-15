<template>
  <v-layout column justify-center align-center>
    <template v-if="$auth.loggedIn">
      <ArtworkExplorer :initial.sync="payload" />
    </template>
    <template v-if="!$auth.loggedIn">
      <v-row style="height: 45vh" align="end">
        <v-col cols="12">
          <span class="splash-logo" @click="expand = !expand">
            art x by x city
          </span>
        </v-col>
      </v-row>
      <v-expand-transition>
        <v-row v-show="expand">
          <v-col cols="auto">
            <nuxt-link to="/login">login</nuxt-link>
          </v-col>
          <v-col cols="auto">
            <nuxt-link to="/register">sign up</nuxt-link>
          </v-col>
        </v-row>
      </v-expand-transition>
    </template>
  </v-layout>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import PageComponent from '~/components/pages/page.component'
import ArtworkExplorer from '~/components/artwork/ArtworkExplorer.component.vue'

@Component({
  components: {
    ArtworkExplorer
  }
})
export default class HomePage extends PageComponent {
  payload: any[] = []
  expand: boolean = false

  async asyncData({ $axios, store, $auth }: Context) {
    if ($auth.loggedIn) {
      try {
        if (!(store.state.artworks.list?.length > 0)) {
          const { payload } = await $axios.$get('/api/artwork')

          store.commit('artworks/set', payload)

          return { payload }
        } else {
          return { payload: store.state.artworks.list }
        }
      } catch (error) {
        console.error(error)
        return { errors: error.response.data?.messages }
      }
    }
  }
}
</script>

<style scoped>
.splash-logo {
  color: black;
  font-size: 72px;
  text-decoration: none;
  cursor: pointer;
}
</style>
