<template>
  <v-menu offset-y left tile>
    <template v-slot:activator="props">
      <v-btn icon v-on="props.on" style="margin-right: 0px;">
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
      <UserAvatar abbr dense :user="$auth.user" />
    </template>
    <v-list dense>
      <v-list-item dense :to="`/${$auth.user.address}`">
        <v-list-item-action>
          <v-icon>mdi-account</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item dense @click="onLogoutClicked">
        <v-list-item-action>
          <v-icon>mdi-logout-variant</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Log Out</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'nuxt-property-decorator'

import { debounce } from '~/helpers'

@Component
export default class AccountMenu extends Vue {
  @debounce
  @Emit('logout') onLogoutClicked() {}
}
</script>
