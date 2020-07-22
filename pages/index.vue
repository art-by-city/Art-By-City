<template>
  <div style="height: 100%">
    <template v-if="$auth.loggedIn">
      <ArtworkExplorer :initial.sync="payload" :options.sync="options" />
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
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import PageComponent from '~/components/pages/page.component'
import ArtworkExplorer from '~/components/artwork/ArtworkExplorer.component.vue'
import { ConfigStoreState } from '~/store/config'

@Component({
  components: {
    ArtworkExplorer
  }
})
export default class HomePage extends PageComponent {
  payload: any[] = []
  config: ConfigStoreState = { cities: [], hashtags: [] }
  options: any
  expand: boolean = false

  async asyncData({ $axios, store, $auth }: Context) {
    if ($auth.loggedIn) {
      const options = { ...store.state.artworks.options }
      let payload = []
      let errors = []
      let config: ConfigStoreState = { cities: [], hashtags: [] }
      try {
        const params = { ...options }

        if (params.type === 'Any') {
          delete params.type
        }

        if (params.city === 'Any') {
          delete params.city
        }

        if (!(store.state.artworks.list?.length > 0)) {
          const artworksResult = await $axios.$get('/api/artwork', { params })
          payload = artworksResult.payload
          store.commit('artworks/set', payload)
        } else {
          payload = store.state.artworks.list
        }

        config = await $axios.$get('/api/config')
        store.commit('config/setConfig', config)
      } catch (error) {
        console.error(error)
        errors = error.response?.data?.messages
      }

      return { errors, payload, options, config }
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
