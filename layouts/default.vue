<template>
  <v-app dark>
    <v-app-bar v-if="$auth.loggedIn" :clipped-left="true" fixed app dense>
      <v-row>
        <v-col cols="4">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-app-bar-nav-icon v-on="on" />
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
            <template v-if="!$auth.loggedIn">
              <v-btn text to="/register">sign up</v-btn>
              <v-divider vertical />
              <v-btn text to="/login">log in</v-btn>
            </template>
            <template v-if="$auth.loggedIn">
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn class="avatar-menu-button" text right v-on="on">
                    <v-badge avatar bottom overlap color="black" :icon="avatarBadge" :value="avatarBadge">
                      <v-avatar color="indigo" size="32">
                        <span class="white--text text-lowercase">
                          {{ avatar }}
                        </span>
                      </v-avatar>
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

    <v-content>
      <v-container fluid style="height: 100%">
        <nuxt />
      </v-container>
    </v-content>

    <v-footer dark>
      <v-spacer></v-spacer>
      <div>&copy; {{ new Date().getFullYear() }}</div>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

import { NavItem } from '../components/types'

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
    }
  ]

  rightNavItems: NavItem[] = [
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

  get isAdmin(): boolean {
    if (this.$auth.user && this.$auth.user.roles) {
      return this.$auth.user.roles.includes('admin')
    }

    return false
  }

  get isArtist(): boolean {
    if (this.$auth.user && this.$auth.user.roles) {
      return this.$auth.user.roles.includes('artist')
    }

    return false
  }

  get avatar(): string {
    if (this.$auth.user.username) {
      return this.$auth.user?.username[0]
    } else {
      return 'u'
    }
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
</style>
