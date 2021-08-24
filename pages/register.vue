<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSeBdtAoUMd5HY2K26Vq8VUdPIFL9VwsLGuYpYqFSyYRHuU3rg/viewform?embedded=true"
          :width="640"
          height="1000"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
        ></iframe>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class RegisterPage extends Vue {
  get iframeWidth() {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs': return '300'
      case 'sm': return '540'
        default: return '640'
    }
  }
}
</script>
