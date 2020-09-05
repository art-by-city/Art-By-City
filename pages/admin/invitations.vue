<template>
  <div>
    <v-breadcrumbs large :items="breadcrumbs"></v-breadcrumbs>

    <v-container fluid>
      <v-row justify="center">
        <v-col cols="4">
          <v-data-table
            :headers="invitationHeaders"
            :items="invitations"
            item-key="id"
            calculate-widths
            dense
          >
            <template v-slot:top>
              <v-toolbar dense elevation="0">
                <v-toolbar-title>invitations</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="invitationSearchTerm"
                  append-icon="mdi-filter"
                  label="filter invitations"
                  single-line
                  hide-details
                ></v-text-field>
              </v-toolbar>
            </template>
            <template v-slot:item.created="{ item }">
              <span>{{ new Date(item.created).toLocaleString() }}</span>
            </template>
            <template v-slot:item.createdByUser="{ item }">
              <nuxt-link :to="`/user/${item.createdByUser.username}`">
                {{ item.createdByUser.username }}
              </nuxt-link>
            </template>
            <template v-slot:item.sentOn="{ item }">
              <span>{{ new Date(item.sentOn).toLocaleString() }}</span>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'
import ToastService from '~/services/toast/service'
import ProgressService from '~/services/progress/service'

@Component({
  middleware: 'role/admin'
})
export default class AdminInvitationsPage extends FormPageComponent {
  breadcrumbs = [
    {
      text: 'Admin',
      disabled: false,
      href: '/admin'
    },
    {
      text: 'Invitations',
      disabled: true,
      href: '/admin/invitations'
    }
  ]
  invitationHeaders = [
    { text: 'code', value: 'id' },
    { text: 'created', value: 'created' },
    { text: 'created by', value: 'createdByUser' },
    { text: 'sent', value: 'sent' },
    { text: 'sent on', value: 'sentOn', },
    { text: '', value: 'actions', sortable: false }
  ]
  invitations: any[] = []
  invitationSearchTerm: string = ''
}

</script>
