<template>
  <v-app-bar
    :clipped-left="true"
    fixed
    app
    dense
    flat
    dark
    class="app-bar"
  >
    <v-btn class="app-logo" text plain to="/">
      ART &times; BY &times; CITY
    </v-btn>

    <v-spacer></v-spacer>

    <template v-if="user">
      {{ user.address }}
      <v-btn text @click="onLogoutClicked">log out</v-btn>
    </template>
    <template v-else>
      <v-btn text @click="onLoginClicked">log in</v-btn>
    </template>

  </v-app-bar>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'

import User from '~/models/user/user'
import { ConfigStoreState } from '~/store/config'
import { debounce } from '~/helpers/helpers'

@Component
export default class AppBar extends Vue {
  @Prop({
    type: Object,
    required: false,
    default: null
  }) readonly user!: User | null

  @Prop({
    type: Object,
    required: true
  }) readonly config!: ConfigStoreState

  @debounce
  @Emit('login') onLoginClicked() {}

  @debounce
  @Emit('logout') onLogoutClicked() {}
}
</script>

<style scoped>
.app-bar >>> .v-toolbar__content {
/* .app-bar { */
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 0;
}

.app-bar >>> a {
  /* color: rgba(0, 0, 0, 0.87); */
  color: white;
  text-decoration: none;
}
</style>
