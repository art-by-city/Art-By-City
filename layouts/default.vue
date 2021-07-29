<template>
  <v-app dark class="app">
    <AppBar
      :config="$config"
      :user="$auth.user"
      @login="login"
      @logout="logout"
    />

    <v-main class="main">
      <v-container fluid class="pl-4 pr-4 pt-7 main-container">
        <nuxt v-if="!$slots.default" />
        <slot />
      </v-container>
    </v-main>

    <Footer :shouldChangelogIconBlink="shouldChangelogIconBlink()" />

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
import { AppBar, Footer } from '~/components/layout'

@Component({
  components: {
    AppBar,
    Footer
  }
})
export default class DefaultLayout extends Vue {
  shouldChangelogIconBlink(): boolean {
    return !this.$changelogService.hasSeenLatestChangelog()
  }

  toasts: ToastMessage[] = []
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
  }

  async login() {
    try {
      await this.$auth.loginWith('arconnect')
    } catch (error) {
      this.$toastService.error(error)
    }
  }

  async logout() {
    await this.$auth.logout()
  }
}
</script>

<style scoped>
.app {
  background-color: #FAFAFA;
}

.main-container {
  height: 100%;
  width: 1250px;
  background-color: white;
}

.toast-alerts-container {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 5;
}

.progress-bar {
  top: 48px;
  position: fixed;
  z-index: 5;
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
