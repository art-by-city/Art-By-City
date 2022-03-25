<template>
  <v-footer dark class="app-footer">
    <!-- <v-container class="app-footer-container"> -->
    <div class="app-footer-container content-container">
      <div class="text-lowercase text-caption">
        <nuxt-link class="white--text mr-2" to="/">Home</nuxt-link>
        <nuxt-link class="white--text mr-2" to="/about">About</nuxt-link>
      </div>
      <v-spacer></v-spacer>
      <div class="text-lowercase text-caption">
        &copy; art x by x city {{ new Date().getFullYear() }}
      </div>
    <!-- </v-container> -->
    </div>
  </v-footer>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class Footer extends Vue {}
</script>

<style scoped lang="scss">
.app-footer {
  z-index: 5;
}
.app-footer-container {
  align-items: inherit;
  display: inherit;
  flex: inherit;
  flex-wrap: inherit;
  transition-duration: inherit;
  transition-property: inherit;
  transition-timing-function: inherit;
  margin-left: auto;
  margin-right: auto;
}
</style>
