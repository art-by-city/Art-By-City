<template>
  <v-app dark class="app">
    <AppBar
      :loading="isLoggingIn"
      @login="login"
      @logout="logout"
      @signup="showSignupModal"
      :transparent="$route.path === '/' && offsetTop < 1000"
    />

    <v-main class="main" v-scroll="onScroll">
      <nuxt v-if="!$slots.default" />
      <slot />
    </v-main>

    <Footer />

    <AuthDialog @login="login" :show.sync="showAuthDialog" />

    <div v-if="toasts" class="toast-alerts-container">
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
import { Component, Vue, Watch } from 'nuxt-property-decorator'

import { ToastMessage } from '~/plugins/toasts'
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
  isLoggingIn: boolean = false
  offsetTop: number = 0

  removeToast(toast: ToastMessage) {
    this.$toasts.remove(toast)
  }

  @Watch('$toasts.list', { immediate: true })
  onToastsChanged(toasts: ToastMessage[]) {
    this.toasts = toasts
  }

  created() {
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

    this.$nuxt.$on('username-CONFIRMED', () => { this.$auth.fetchUser() })
  }

  async login() {
    try {
      this.isLoggingIn = true
      await this.$auth.loginWith('arweave-wallet')
      this.$nuxt.$emit('auth-completed')
      this.showAuthDialog = 'alpha-agreement'
    } catch (error) {
      if (error instanceof ArweaveWalletNotInstalledError) {
        this.showAuthDialog = 'sign-up'
      } else {
        this.$toasts.error(error)
      }
    } finally {
      this.isLoggingIn = false
    }
  }

  async logout() {
    await this.$auth.logout()
  }

  async showSignupModal() {
    this.showAuthDialog = 'sign-up'
  }

  onScroll(e: Event) {
    if (e.target) {
      this.offsetTop = (e.target as any).scrollingElement.scrollTop || 0
    }
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
