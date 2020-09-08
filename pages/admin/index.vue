<template>
  <div>
    <v-breadcrumbs large :items="breadcrumbs"></v-breadcrumbs>

    <v-list>
      <v-subheader>admin pages</v-subheader>
      <v-list-item-group>
        <v-list-item v-for="(item, i) in adminPageLinks" :key="i" >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <nuxt-link :to="item.to">{{ item.text }}</nuxt-link>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'

@Component({
  middleware: 'role/admin'
})
export default class AdminIndexPage extends FormPageComponent {
  breadcrumbs = [
    {
      text: 'Admin',
      disabled: true,
      href: '/admin'
    }
  ]
  adminPageLinks = [
    { text: 'Artwork', icon: 'mdi-image-multiple', to: '/admin/artwork' },
    { text: 'Users', icon: 'mdi-table-account', to: '/admin/users' },
    { text: 'Invitations', icon: 'mdi-email-plus', to: '/admin/invitations' },
    { text: 'Config', icon: 'mdi-card-bulleted-settings', to: '/admin/config' },
    { text: 'Cities', icon: 'mdi-map', to: '/admin/cities' },
    { text: 'Event Log', icon: 'mdi-table-clock', to: '/admin/events' },
  ]
}
</script>
