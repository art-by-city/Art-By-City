<template>
  <v-app-bar
    v-if="user"
    :clipped-left="true"
    fixed
    app
    dense
    elevation="1"
  >
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

    <v-spacer></v-spacer>

    <v-toolbar-title>
      <nuxt-link to="/">art x by x city</nuxt-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <template v-if="!user">
        <v-btn text to="/register">sign up</v-btn>
        <v-divider vertical />
        <v-btn text to="/login">log in</v-btn>
      </template>
      <template v-if="user">
        <v-menu offset-y>
          <template v-slot:activator="props">
            <v-btn class="avatar-menu-button" text right v-on="props.on">
              <UserAvatar
                :user="user"
                :baseUrl="config.imgBaseUrl"
                dense
                abbr
              />
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
            <v-list-item @click="onLogoutClicked">
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
  </v-app-bar>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'

import { NavItem } from '../types'
import User from '~/models/user/user'
import { ConfigStoreState } from '~/store/config'

@Component
export default class AppBar extends Vue {
  @Prop({
    type: Object,
    required: false,
    default: null
  }) readonly user!: User | null

  @Prop({
    type: Object,
    required: true
  }) readonly config!: ConfigStoreState

  @Emit('logout') onLogoutClicked() {}

  leftNavItems: NavItem[] = [
    {
      icon: 'mdi-apps',
      title: 'home',
      to: '/'
    },
    {
      icon: 'mdi-upload',
      title: 'upload',
      to: '/upload'
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
        title: 'my profile',
        to: `/${this.user?.username || ''}`
      },
      {
        icon: 'mdi-folder-multiple-image',
        title: 'my portfolio',
        to: '/portfolio'
      },
      {
        icon: 'mdi-account-settings',
        title: 'settings',
        to: '/settings'
      },
      {
        icon: 'mdi-wallet',
        title: 'wallet',
        to: '/wallet'
      }
    ]
  }

  private filterNavItemsForUserRoles(navItems: NavItem[]): NavItem[] {
    return navItems.filter(
      (navItem) =>
        !navItem.only ||
        navItem.only.every(
          (role) => this.user && this.user.roles?.includes(role)
        )
    )
  }
}
</script>

<style scoped>
div.v-toolbar__content div.v-toolbar__title a {
  color: rgba(0, 0, 0, 0.87);
  text-decoration: none;
}
</style>
