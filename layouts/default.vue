<template>
  <v-app dark class="app">
    <AppBar
      :config="$config"
      @login="login"
      @logout="logout"
      @signup="showSignupModal"
    />

    <v-main class="main">
      <!-- <v-container fluid class="pl-4 pr-4 pt-7 main-container"> -->
      <nuxt v-if="!$slots.default" />
      <slot />
      <!-- </v-container> -->
    </v-main>

    <Footer />

    <AuthDialog @login="login" :show.sync="showAuthDialog" />

    <div class="toast-alerts-container">
      <v-alert
        v-for="(toast, i) in toasts"
        :key="i"
        v-model="toast.show"
        :type="toast.type"
        dismissible
        transition="fade-transition"
      >
        {{ toast.message }}
        <template v-slot:close="{ toggle }">
          <v-btn
            rounded
            icon
            dark
            small
            aria-label="Close"
            @click="removeToast(toast)"
          >
            <v-icon dark>mdi-close-circle</v-icon>
          </v-btn>
        </template>
      </v-alert>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

import ToastMessage from '~/models/toasts/toastMessage'
import { AppBar, Footer, AuthDialog } from '~/components'
import { ArweaveWalletNotInstalledError } from '~/schemes/arweave-wallet'

@Component({
  components: {
    AppBar,
    Footer,
    AuthDialog
  }
})
export default class DefaultLayout extends Vue {
  toasts: ToastMessage[] = []
  showAuthDialog: string = ''

  removeToast(toast: ToastMessage) {
    this.$store.commit('toasts/remove', toast)
  }

  created() {
    this.$store.watch(
      (state) => state.toasts.list,
      () => {
        this.toasts = this.$store.state.toasts.list
      }
    )
    // if (this.$auth.loggedIn) {
    //   this.$store.watch(
    //     (state) => state.auth.user.changelogLastVersionViewed,
    //     () => {
    //       this.$forceUpdate()
    //     }
    //   )
    // }

    this.$nuxt.$on('needs-auth', (cb: Function) => {
      if (this.$auth.loggedIn) {
        cb()
      } else {
        this.$nuxt.$once('auth-completed', () => {
          cb()
        })
        this.showSignupModal()
      }
    })
  }

  async login() {
    try {
      await this.$auth.loginWith('arweave-wallet')
      this.$nuxt.$emit('auth-completed')
      this.showAuthDialog = 'alpha-agreement'
    } catch (error) {
      if (error instanceof ArweaveWalletNotInstalledError) {
        this.showAuthDialog = 'sign-up'
      } else {
        this.$toastService.error(error)
      }
    }
  }

  async logout() {
    await this.$auth.logout()
  }

  async showSignupModal() {
    this.showAuthDialog = 'sign-up'
  }
}
</script>

<style scoped>
.app {
  background-color: white;
}

.main-container {
  height: 100%;
  background-color: white;
}

.toast-alerts-container {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 9999;
}

.progress-bar {
  top: 48px;
  position: fixed;
  z-index: 9999;
}

.notification-icon >>> .v-badge__badge {
  animation: ripple 2s infinite;
}

@keyframes blink {
  0% {
    background-color: red;
  }
  25% {
    background-color: yellow;
  }
  50% {
    background-color: blue;
  }
  100% {
    background-color: green;
  }
}

/* rgb(110, 81, 255) */
@keyframes ripple {
  0% {
    box-shadow: 0 0 0 0rem rgba(110, 81, 255, 0.4);
  }
  25% {
    box-shadow: 0 0 0 0.5rem rgba(110, 81, 255, 0.4);
  }
  100% {
    box-shadow: 0 0 0 0rem rgba(110, 81, 255, 0.4);
  }
}
</style>
