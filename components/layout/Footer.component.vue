<template>
  <v-footer dark style="z-index: 5;">
    <div class="text-lowercase text-caption">
      <nuxt-link class="white--text mr-2" to="/">Home</nuxt-link>
      <nuxt-link class="white--text mr-2" to="/about">About</nuxt-link>
      <template v-if="isLoggedIn">
        <v-badge
          dot
          overlap
          color="rgb(110, 81, 255)"
          :value="shouldChangelogIconBlink"
          class="notification-icon"
        >
          <nuxt-link class="white--text mr-2" to="/changelog">
            What's New
          </nuxt-link>
        </v-badge>
      </template>
    </div>
    <v-spacer></v-spacer>
    <div class="text-lowercase text-caption">
      &copy; art x by x city {{ new Date().getFullYear() }}
    </div>
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
