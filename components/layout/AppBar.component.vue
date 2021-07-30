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
      <UserAvatar abbr dense :user="user" baseUrl="" />

      <v-divider vertical dark class="mx-4" />

      <v-menu offset-y>
        <template v-slot:activator="props">
          <v-btn icon v-on="props.on" style="margin-right: 0px;">
            <v-icon>mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item dense @click="onLogoutClicked">
            <v-list-item-action>
              <v-icon>mdi-logout-variant</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>log out</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
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
