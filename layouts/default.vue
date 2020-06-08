<template>
  <v-app dark>
    <v-app-bar :clipped-left="true" fixed app>
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

      <v-spacer />

      <v-toolbar-title>
        <nuxt-link to="/">art x by x city</nuxt-link>
      </v-toolbar-title>

      <v-spacer />

      <v-toolbar-items>
        <template v-if="!$auth.loggedIn">
          <v-btn text to="/register">Sign Up</v-btn>
          <v-divider vertical />
          <v-btn text to="/login">Log In</v-btn>
        </template>
        <template v-if="$auth.loggedIn">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on">
                <v-avatar color="indigo">
                  <span class="white--text">{{ avatar }}</span>
                </v-avatar>
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
                  <v-list-item-title>Log Out</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
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
      title: 'Home',
      to: '/'
    },
    {
      icon: 'mdi-account-cowboy-hat',
      title: 'Admin',
      to: '/admin',
      only: ['admin']
    },
    {
      icon: 'mdi-cart',
      title: 'Shop (Coming Soon!)',
      to: '/',
      disabled: true
    }
  ]

  rightNavItems: NavItem[] = [
    {
      icon: 'mdi-account',
      title: 'My Account',
      to: '/account'
    },
    {
      icon: 'mdi-brush',
      title: 'My Artwork',
      to: '/user/artwork',
      only: ['artist']
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
      return 'User'[0]
    }
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
</style>
