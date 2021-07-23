<template>
  <default-layout>
    <v-navigation-drawer
      fixed
      clipped
      permanent
      :mini-variant="isMobile"
      class="mt-10"
    >
      <v-list>
        <v-list-item-group>
          <v-list-item v-for="(item, i) in adminPageLinks" :key="i" :to="item.to">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              {{ item.text }}
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-container fluid>
      <v-row>
        <v-col offset="2" cols="10">
          <v-breadcrumbs :large="!isMobile" :items="breadcrumbs"></v-breadcrumbs>
        </v-col>
      </v-row>
      <v-row>
        <v-col offset="2" cols="10">
          <nuxt />
        </v-col>
      </v-row>
    </v-container>
  </default-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

import DefaultLayout from './default.vue'
import { Breadcrumb } from '../components/types'

@Component({
  components: {
    DefaultLayout
  }
})
export default class AdminLayout extends Vue {
  adminPageLinks = [
    // { text: 'Artwork', icon: 'mdi-image-multiple', to: '/admin/artwork' },
    // { text: 'Users', icon: 'mdi-table-account', to: '/admin/users' },
    // { text: 'Invitations', icon: 'mdi-email-plus', to: '/admin/invitations' },
    // { text: 'Config', icon: 'mdi-card-bulleted-settings', to: '/admin/config' },
    // { text: 'Cities', icon: 'mdi-map', to: '/admin/cities' },
    // { text: 'Event Log', icon: 'mdi-table-clock', to: '/admin/events' },
    { text: 'Theme', icon: 'mdi-theme-light-dark', to: '/admin/theme' }
  ]

  get breadcrumbs(): Breadcrumb[] {
    const crumbs = [
      {
        text: 'Admin',
        disabled: true,
        href: '/admin'
      }
    ]

    if (this.$route.path !== crumbs[0].href) {
      crumbs[0].disabled = false
      crumbs.splice(1, 0, {
        disabled: true,
        href: this.$route.path,
        text: this.resolveAdminSubpageTitle()
      })
    }

    return crumbs
  }

  resolveAdminSubpageTitle(): string {
    for (let i = 0; i < this.adminPageLinks.length; i++) {
      if (this.adminPageLinks[i].to === this.$route.path) {
        return this.adminPageLinks[i].text
      }
    }

    return ''
  }

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
}
</script>
