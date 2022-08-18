<template>
  <v-app-bar
    fixed
    app
    dense
    flat
    dark
    max-width="100%"
    class="app-bar"
    :class="{ transparent }"
  >
    <v-btn id="app-logo" text tile color="white" plain to="/">
      <img
        id="app-logo-image"
        src="/logo/logo_by_daliah_ammar_dark_transparent.png"
      />
    </v-btn>

    <v-spacer></v-spacer>

    <v-btn
      class="app-bar-button"
      to="/discover"
      text
      tile
    >
      discover
    </v-btn>
    <v-divider v-if="!$auth.loggedIn" vertical class="divider" />

    <template v-if="$auth.loggedIn">
      <v-btn
        class="app-bar-button"
        to="/publish"
        text
        tile
      >
        publish
      </v-btn>
      <v-btn
        class="app-bar-button"
        to="/earn"
        text
        tile
      >
        earn
      </v-btn>
      <v-btn
        v-if="$auth.user.roles && $auth.user.roles.includes('admin')"
        class="app-bar-button"
        to="/stats"
        text
        tile
      >
        stats
      </v-btn>
      <v-divider vertical class="ml-0 mr-4 divider" />
      <AccountMenu @logout="onLogoutClicked" />
      <NotificationsMenu />
      <TransactionsMenu />
    </template>
    <template v-else>
      <v-btn
        v-if="!isMobile"
        class="app-bar-button"
        @click="onLoginClicked"
        text
        tile
        :loading="loading"
        :disabled="loading"
      >log in</v-btn>
      <v-divider vertical class="divider" />
      <v-btn
        class="app-bar-button last"
        @click="onSignUpClicked"
        text
        tile
      >sign up</v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'

import { debounce } from '~/app/util'
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
    type: Boolean,
    required: false,
    default: false
  }) readonly loading: boolean | undefined

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly transparent: boolean | undefined

  get isMobile() {
    return ['xs', 'sm', 'md'].includes(this.$vuetify.breakpoint.name)
  }

  @debounce
  @Emit('login') onLoginClicked() {}

  @debounce
  @Emit('signup') onSignUpClicked() {}

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

.app-bar >>> .app-bar-button {
  height: 100%;
}

.app-bar >>> .app-bar-button.last {
  padding-right: 0;
}

.app-bar.transparent >>> .app-bar-button.last {
  padding-right: 16px;
}

.app-bar.transparent >>> #app-logo {
  display: none;
}

#app-logo >>> .v-btn__content {
  opacity: 1 !important;
}

#app-logo-image {
  width: 120px;
  height: 36px;
}

.divider {
  border-color: white;
}

.app-bar.transparent >>> .divider {
  border-color: transparent;
}
</style>
