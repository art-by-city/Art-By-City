<template>
  <v-footer dark class="app-footer">
    <!-- <div class="app-footer-container"> -->
      <div class="text-lowercase text-caption">
        <nuxt-link class="white--text mr-2" to="/">Home</nuxt-link>
        <nuxt-link class="white--text mr-2" to="/about">About</nuxt-link>
      </div>
      <v-spacer></v-spacer>
      <div class="text-lowercase text-caption">
        &copy; art x by x city {{ new Date().getFullYear() }}
      </div>
    <!-- </div> -->
  </v-footer>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class Footer extends Vue {
  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly isLoggedIn!: boolean

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly shouldChangelogIconBlink!: boolean
}
</script>

<style scoped>
.app-footer {
  z-index: 5;
}
</style>
