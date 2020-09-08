<template>
  <div>
    <v-breadcrumbs large :items="breadcrumbs"></v-breadcrumbs>

    <v-container fluid>
      <v-row justify="center">
        <v-col cols="8">
          <v-data-table
            :headers="invitationHeaders"
            :items="invitations"
            :search="invitationSearchTerm"
            item-key="id"
            sort-by="created"
            sort-desc
            calculate-widths
            dense
          >
            <template v-slot:top>
              <v-toolbar dense elevation="0">
                <v-toolbar-title>invitations</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon color="green" @click="onNewInvitationButtonClicked">
                  <v-icon>mdi-email-plus</v-icon>
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
            <template v-slot:item.created="props">
              <v-tooltip top>
                <template v-slot:activator="activator">
                  <span v-on="activator.on">{{ props.item.created | humanDateDiff }}</span>
                </template>
                <span>{{ props.item.created | localeDate }}</span>
              </v-tooltip>
            </template>
            <template v-slot:item.createdByUser="props">
              <nuxt-link :to="`/user/${props.item.createdByUser.username}`">
                {{ props.item.createdByUser.username }}
              </nuxt-link>
            </template>
            <template v-slot:item.sent="props">
              <v-simple-checkbox v-model="props.item.sent" disabled></v-simple-checkbox>
            </template>
            <template v-slot:item.sentOn="props">
              <v-tooltip top>
                <template v-slot:activator="activator">
                  <span v-on="activator.on">{{ props.item.sentOn | humanDateDiff }}</span>
                </template>
                <span>{{ props.item.sentOn | localeDate }}</span>
              </v-tooltip>
            </template>
            <template v-slot:item.used="props">
              <v-simple-checkbox v-model="props.item.used" disabled></v-simple-checkbox>
            </template>
            <template v-slot:item.usedOn="props">
              <v-tooltip top>
                <template v-slot:activator="activator">
                  <span v-on="activator.on">{{ props.item.usedOn | humanDateDiff }}</span>
                </template>
                <span>{{ props.item.usedOn | localeDate }}</span>
              </v-tooltip>
            </template>
            <template v-slot:item.usedByUser="props">
              <nuxt-link
                v-if="props.item.usedByUser"
                :to="`/user/${props.item.usedByUser.username}`"
              >
                {{ props.item.usedByUser.username }}
              </nuxt-link>
            </template>
            <template v-slot:item.actions="props">
              <v-btn icon @click="onCopyInviteLinkClicked(props.item)">
                <v-icon>mdi-link-variant</v-icon>
              </v-btn>
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
    { text: 'used', value: 'used', },
    { text: 'used on', value: 'usedOn', },
    { text: 'used by', value: 'usedByUser', },
    { text: '', value: 'actions', sortable: false }
  ]
  invitations: Invitation[] = []
  invitationSearchTerm: string = ''

  async asyncData({ app }: Context) {
    try {
      const invitations = await app.$invitationService.fetchInvitations()

      if (invitations) {
        return { invitations }
      }

      return { invitations: [] }
    } catch (error) {
      ToastService.error(error)
    }
  }

  async onNewInvitationButtonClicked() {
    try {
      const invitation = await this.$invitationService.requestNewInvitation()
      if (invitation) {
        this.invitations.push(invitation)
      } else {
        throw new Error('error requesting new invitation')
      }
    } catch (error) {
      ToastService.error(error)
    }
  }

  async onCopyInviteLinkClicked(invitation: Invitation) {
    try {
      await navigator.clipboard.writeText(`${process.env.baseUrl}/register?invite=${invitation.id}`)
      ToastService.info('invitation link copied to clipboard')
    } catch (error) {}
  }
}

</script>
