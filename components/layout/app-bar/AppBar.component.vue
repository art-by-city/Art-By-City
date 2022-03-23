<template>
  <v-app-bar
    fixed
    app
    dense
    flat
    dark
    max-width="100%"
    class="app-bar"
  >
    <v-btn id="app-logo" text tile color="white" plain to="/">
      <!-- ART &times; BY &times; CITY -->
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
    <v-divider v-if="!$auth.loggedIn" vertical class="white-divider" />

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
      <v-divider vertical class="ml-0 mr-4 white-divider" />
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
      <v-divider vertical class="white-divider" />
      <v-btn
        class="app-bar-button pr-0"
        @click="onSignUpClicked"
        text
        tile
      >sign up</v-btn>
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

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly loading: boolean | undefined

  get isMobile() {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
      case 'sm':
      case 'md': return true
      case 'lg':
      case 'xl':
        default: return false
    }
  }

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

.app-bar >>> .app-bar-button {
  height: 100%;
}

#app-logo >>> .v-btn__content {
  opacity: 1 !important;
}

#app-logo-image {
  width: 120px;
  height: 36px;
}

.white-divider {
  border-color: white;
}
</style>
