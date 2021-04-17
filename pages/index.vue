<template>
  <div style="height: 100%">
    <template v-if="$auth.loggedIn">
      <ArtworkExplorer
        :initial.sync="payload"
        :options.sync="options"
        :baseUrl="$config.imgBaseUrl"
        :displayBreakpoint="$vuetify.breakpoint.name"
      />
    </template>
    <template v-if="!$auth.loggedIn">
      <v-row style="height: 45vh" align="end">
        <v-col cols="12" style="text-align: center;">
          <SplashLogo @click="expand = !expand" />
        </v-col>
      </v-row>
      <v-expand-transition>
        <v-row v-show="expand" justify="center">
          <v-col cols="12" style="text-align: center;">
            <v-btn text class="text-lowercase" to="/login">login</v-btn>
            <v-btn text class="text-lowercase" to="/register">sign up</v-btn>
          </v-col>
        </v-row>
      </v-expand-transition>
    </template>
  </div>
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
  options: any
  expand: boolean = false

  async asyncData({ $axios, store, $auth }: Context) {
    if ($auth.loggedIn) {
      const options = { ...store.state.artworks.options }
      let payload = []
      try {
        const params = { ...options }

        if (params.type === 'All') {
          delete params.type
        }

        if (params.city === 'All') {
          delete params.city
        }

        if (!(store.state.artworks.list?.length > 0)) {
          const artworksResult = await $axios.$get('/api/artwork', { params })
          payload = artworksResult.payload
          store.commit('artworks/add', payload)
        } else {
          payload = store.state.artworks.list
        }
      } catch (error) {
        console.error(error)
      }

      return { payload, options }
    }
  }
}
</script>

<style scoped>
.splash-logo {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
