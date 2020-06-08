<template>
  <v-layout column justify-center align-center>
    <ArtworkExplorer :initial.sync="payload" />
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

  async asyncData({ $axios }: Context) {
    try {
      const { payload } = await $axios.$get('/api/artwork')

      return { payload }
    } catch (error) {
      return { errors: error.response.data.messages }
    }
  }
}
</script>
