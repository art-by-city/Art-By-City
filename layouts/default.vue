<template>
  <v-app dark>
    <AppBar
      :config="$config"
      :user="user"
      @logout="logout"
    />

    <v-main>
      <v-container fluid style="height: 100%">
        <nuxt v-if="!$slots.default" />
        <slot />
      </v-container>
    </v-main>

    <v-footer dark>
      <div class="text-lowercase">
        <nuxt-link class="white--text mr-2" to="/">Home</nuxt-link>
        <nuxt-link class="white--text mr-2" to="/about">About</nuxt-link>
        <template v-if="$auth.loggedIn">
          <v-badge
            dot
            overlap
            color="rgb(110, 81, 255)"
            :value="shouldChangelogIconBlink()"
            class="notification-icon"
          >
            <nuxt-link class="white--text mr-2" to="/changelog">
              What's New
            </nuxt-link>
          </v-badge>
        </template>
      </div>
      <v-spacer></v-spacer>
      <div>&copy; art x by x city {{ new Date().getFullYear() }}</div>
    </v-footer>

    <div class="toast-alerts-container">
      <v-alert
        v-for="(toast, i) in toasts"
        :key="i"
        v-model="toast.show"
        :type="toast.type"
        dismissible
        transition="fade-transition"
        width="20vw"
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
import User, { getUser } from '../models/user/user'
import { AppBar } from '~/components/layout'

@Component({
  components: {
    AppBar
  }
})
export default class DefaultLayout extends Vue {
  get user(): User | null {
    return getUser(this.$auth.user)
  }

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
    if (this.$auth.loggedIn) {
      this.$store.watch(
        (state) => state.auth.user.changelogLastVersionViewed,
        () => {
          this.$forceUpdate()
        }
      )
    }
  }

  private async logout() {
    await this.$auth.logout()
  }
}
</script>

<style scoped>
.toast-alerts-container {
  position: fixed;
  bottom: 32px;
  right: 32px;
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
