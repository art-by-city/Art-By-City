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
    <v-btn class="app-logo" text color="white" plain to="/">
      ART &times; BY &times; CITY
    </v-btn>

    <v-spacer></v-spacer>

    <template v-if="$auth.loggedIn">
      <v-btn text to="/publish">publish</v-btn>
      <v-divider vertical class="mx-4 white-divider" />
      <AccountMenu @logout="onLogoutClicked" />
      <NotificationsMenu />
      <TransactionsMenu />
    </template>
    <template v-else>
      <v-btn text @click="onLoginClicked">log in</v-btn>
      <v-divider vertical class="white-divider" />
      <v-btn text @click="onSignUpClicked">sign up</v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'

import { ConfigStoreState } from '~/store/config'
import { debounce } from '~/helpers'
import AccountMenu from './AccountMenu.component.vue'
import TransactionsMenu from './TransactionsMenu.component.vue'
import NotificationsMenu from './NotificationsMenu.component.vue'

@Component({
  components: {
    AccountMenu,
    TransactionsMenu,
    NotificationsMenu
  }
})
export default class AppBar extends Vue {
  @Prop({
    type: Object,
    required: true
  }) readonly config!: ConfigStoreState

  @debounce
  @Emit('login') onLoginClicked() {}

  @debounce
  @Emit('signup') onSignUpClicked() {}

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

.app-logo >>> .v-btn__content {
  opacity: 1 !important;
}

.white-divider {
  border-color: white;
}
</style>
