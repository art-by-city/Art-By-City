<template>
  <v-container fluid>
    <v-row justify="center">
      <v-dialog v-model="sendInviteEmailModalShown" persistent max-width="600px">
        <v-form ref="form" v-model="valid" @submit.prevent="onInviteEmailModalSaveClicked">
          <v-card v-if="invitationToSend">
            <v-card-title>{{ invitationToSend.sent ? 're-' : '' }}send invitation email</v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="invitationToSend.id"
                      label="code"
                      disabled
                    ></v-text-field>
                    <v-checkbox
                      v-model="invitationToSend.sent"
                      label="sent"
                      disabled
                    ></v-checkbox>
                    <DateWithTooltip :date="invitationToSend.sentOn" />
                    <v-text-field
                      v-model="invitationToSend.sentToEmail"
                      label="email"
                      required
                      :rules="emailRules"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn icon color="red" @click="closeInviteEmailModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-btn icon color="green" type="submit">
                <v-icon>mdi-email-send</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>

      <v-col cols="10">
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
            <DateWithTooltip :date="props.item.created" />
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
            <DateWithTooltip :date="props.item.sentOn" />
          </template>
          <template v-slot:item.used="props">
            <v-simple-checkbox v-model="props.item.used" disabled></v-simple-checkbox>
          </template>
          <template v-slot:item.usedOn="props">
            <DateWithTooltip :date="props.item.usedOn" />
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
            <v-btn icon @click="onSendInviteEmailClicked(props.item)">
              <v-icon>mdi-email-send</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'
import ToastService from '~/services/toast/service'
import ProgressService from '~/services/progress/service'
import Invitation from '~/models/invitation'
import InvitationService from '~/services/invitation/service'
import { emailRules } from '~/models/user/validation'

@Component({
  middleware: 'role/admin',
  layout: 'admin'
})
export default class AdminInvitationsPage extends FormPageComponent {
  invitationHeaders = [
    { text: 'code', value: 'id' },
    { text: 'created on', value: 'created' },
    { text: 'created by', value: 'createdByUser' },
    { text: 'sent', value: 'sent' },
    { text: 'sent on', value: 'sentOn', },
    { text: 'sent to', value: 'sentToEmail' },
    { text: 'used', value: 'used', },
    { text: 'used on', value: 'usedOn', },
    { text: 'used by', value: 'usedByUser', },
    { text: '', value: 'actions', sortable: false }
  ]
  emailRules = emailRules
  invitations: Invitation[] = []
  invitationSearchTerm: string = ''
  sendInviteEmailModalShown: boolean = false
  invitationToSend: Invitation | null = null

  async asyncData({ app }: Context) {
    try {
      const invitations = await app.$invitationService.fetchInvitations()

      if (invitations) {
        return { invitations }
      }

      return { invitations: [], invitationToSend: null }
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
      await navigator.clipboard.writeText(
        `${process.env.baseUrl}/register?invite=${invitation.id}`
      )
      ToastService.info('invitation link copied to clipboard')
    } catch (error) {}
  }

  async sendInviteEmail(invitation: Invitation) {
    try {
      const sentInvitation = await this.$invitationService.sendInvitationEmail(invitation)

      if (sentInvitation) {
        for (let i = 0; i < this.invitations.length; i++) {
          if (this.invitations[i].id === sentInvitation.id) {
            this.invitations.splice(i, 1, sentInvitation)
            continue
          }
        }
      }

      this.closeInviteEmailModal()
    } catch (error) {}
  }

  async onSendInviteEmailClicked(invitation: Invitation) {
    this.openInviteEmailModal(invitation)
  }

  async onInviteEmailModalSaveClicked() {
    if (this.invitationToSend) {
      await this.sendInviteEmail(this.invitationToSend)
    }
  }

  openInviteEmailModal(invitation: Invitation) {
    this.invitationToSend = invitation
    this.sendInviteEmailModalShown = true
  }

  closeInviteEmailModal() {
    this.sendInviteEmailModalShown = false
  }
}

</script>
