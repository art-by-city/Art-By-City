<template>
  <v-app dark>
    <v-app-bar v-if="isLoggedIn" :clipped-left="true" fixed app dense elevation="1">
      <v-row>
        <v-col cols="4">
          <v-menu offset-y>
            <template v-slot:activator="props">
              <v-app-bar-nav-icon v-on="props.on" />
            </template>
            <v-list dense>
              <v-list-item
                v-for="(navItem, i) in filterNavItemsForUserRoles(leftNavItems)"
                :key="i"
                :to="navItem.to"
                router
                exact
                :disabled="navItem.disabled"
              >
                <v-list-item-action>
                  <v-icon>{{ navItem.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="navItem.title" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>

        <v-col cols="4" class="text-center logo-col" align-self="center">
          <v-toolbar-title>
            <nuxt-link to="/">art x by x city</nuxt-link>
          </v-toolbar-title>
        </v-col>

        <v-col cols="4" class="text-center">
          <v-toolbar-items>
            <template v-if="!isLoggedIn">
              <v-btn text to="/register">sign up</v-btn>
              <v-divider vertical />
              <v-btn text to="/login">log in</v-btn>
            </template>
            <template v-if="isLoggedIn">
              <v-menu offset-y>
                <template v-slot:activator="props">
                  <v-btn class="avatar-menu-button" text right v-on="props.on">
                    <v-badge
                      avatar
                      bottom
                      overlap
                      color="black"
                      :icon="avatarBadge"
                      :value="avatarBadge"
                    >
                      <UserAvatar
                        :user="$auth.user"
                        small
                        abbr
                      />
                    </v-badge>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item
                    v-for="(navItem, i) in filterNavItemsForUserRoles(
                      rightNavItems
                    )"
                    :key="i"
                    :to="navItem.to"
                    router
                    exact
                    :disabled="navItem.disabled"
                  >
                    <v-list-item-action>
                      <v-icon>{{ navItem.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>{{ navItem.title }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="logout">
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
          </v-toolbar-items>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-main>
      <v-container fluid style="height: 100%">
        <nuxt v-if="!$slots.default" />
        <slot />
      </v-container>
    </v-main>

    <v-footer dark>
      <nuxt-link class="white--text text-lowercase" to="/about">About</nuxt-link>
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
            rounded icon dark small aria-label="Close"
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
import { Vue, Component, Watch } from 'nuxt-property-decorator'

import { NavItem } from '../components/types'
import ToastMessage from '~/models/toasts/toastMessage'

@Component
export default class DefaultLayout extends Vue {
  leftNavItems: NavItem[] = [
    {
      icon: 'mdi-apps',
      title: 'home',
      to: '/'
    },
    {
      icon: 'mdi-account-cowboy-hat',
      title: 'admin',
      to: '/admin',
      only: ['admin']
    },
    {
      icon: 'mdi-information',
      title: 'about',
      to: '/about'
    }
  ]

  get rightNavItems(): NavItem[] {
    return [
      {
        icon: 'mdi-account',
        title: 'my account',
        to: '/account'
      },
      {
        icon: 'mdi-account',
        title: 'my profile',
        to: `/user/${this.$auth.user?.username || ''}`
      },
      {
        icon: 'mdi-brush',
        title: 'my artwork',
        to: '/user/artwork'
      }
    ]
  }

  get isAdmin(): boolean {
    if (this.$auth.user && this.$auth.user.roles) {
      return this.$auth.user.roles.includes('admin')
    }

    return false
  }

  get isLoggedIn(): boolean {
    return this.$auth.loggedIn
  }

  get isArtist(): boolean {
    if (this.$auth.user && this.$auth.user.roles) {
      return this.$auth.user.roles.includes('artist')
    }

    return false
  }

  get avatarBadge(): string {
    if (this.isAdmin) {
      return 'mdi-account-cowboy-hat'
    }

    if (this.isArtist) {
      return 'mdi-brush'
    }

    return ''
  }

  toasts: ToastMessage[] = []
  removeToast(toast: ToastMessage) {
    this.$store.commit('toasts/remove', toast)
  }

  created() {
    this.$store.watch(state => state.toasts.list, () => {
      this.toasts = this.$store.state.toasts.list
    })
  }

  async fetch() {
    await this.$configService.fetchAndSetStoreConfig()
  }

  private filterNavItemsForUserRoles(navItems: NavItem[]): NavItem[] {
    return navItems.filter(
      (navItem) =>
        !navItem.only ||
        navItem.only.every((role) => this.$auth.user?.roles?.includes(role))
    )
  }

  private async logout() {
    await this.$auth.logout()
  }
}
</script>

<style scoped>
div.v-toolbar__content div.v-toolbar__title a {
  color: rgba(0, 0, 0, 0.87);
  text-decoration: none;
}

.logo-col {
  padding-left: 16px;
}

.avatar-menu-button {
  position: absolute;
  right: 0px;
  top: 0px;
}

.toast-alerts-container {
  position: absolute;
  bottom: 32px;
  right: 32px;
}

.progress-bar {
  top: 48px;
  position: fixed;
  z-index: 5;
}
</style>
