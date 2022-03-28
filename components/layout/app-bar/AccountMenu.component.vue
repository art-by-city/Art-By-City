<template>
  <v-menu offset-y left tile>
    <template v-slot:activator="props">
      <v-btn icon v-on="props.on" style="margin-right: 0px;">
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
      <UserAvatar dark dense :user="$auth.user" usernameWidth="120px" />
    </template>
    <v-list dense>
      <v-list-item
        dense exact
        :to="`/${$auth.user.username || $auth.user.address}`"
      >
        <v-list-item-action>
          <v-icon>mdi-account</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        dense
        exact
        :to="`/${$auth.user.username || $auth.user.address}#liked`"
      >
        <v-list-item-action>
          <v-icon>mdi-heart</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Liked</v-list-item-title>
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

import { debounce } from '~/app/util'

@Component
export default class AccountMenu extends Vue {
  @debounce
  @Emit('logout') onLogoutClicked() {}
}
</script>
