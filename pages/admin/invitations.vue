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
                <v-btn icon color="green" @click="onNewInvitationButtonClicked">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
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
import Invitation from '~/models/invitation'
import InvitationService from '~/services/invitation/service'

@Component({
  middleware: 'role/admin'
})
export default class AdminInvitationsPage extends FormPageComponent {
  $invitationService!: InvitationService
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
    { text: 'created on', value: 'created' },
    { text: 'created by', value: 'createdByUser' },
    { text: 'sent', value: 'sent' },
    { text: 'sent on', value: 'sentOn', },
    { text: '', value: 'actions', sortable: false }
  ]
  invitations: Invitation[] = []
  invitationSearchTerm: string = ''

  async onNewInvitationButtonClicked() {
    try {
      const invitation = await this.$invitationService.requestNewInvitation()
      console.log('invitation?', invitation)
      if (invitation) {
        this.invitations.push(invitation)
      } else {
        throw new Error('error requesting new invitation')
      }
    } catch (error) {
      ToastService.error(error)
    }
  }
}

</script>
