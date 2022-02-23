<template>
  <v-dialog
    :value="open"
    persistent
    @click:outside="onCloseDialog"
    width="400"
  >
    <v-container dense class="pa-1">
      <v-row dense>
        <v-col dense cols="12" class="pa-0">
          <v-card>
            <v-card-title>Register Username</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-form ref="form" v-model="valid" autocomplete="off">
                <v-text-field
                  v-model="asset"
                  type="text"
                  name="username"
                  label="Username"
                  counter="64"
                  :rules="[() => !!asset || 'Required' ]"
                  :loading="isValidating"
                  :error-messages="usernameErrors"
                  @input="dirty = true"
                  :messages="messages"
                  :color="color"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-container>
                <v-row justify="center">
                  <TransactionFormControls
                    :loading="isUploading || isValidating"
                    :disabled="isValidating || !valid || !dirty"
                    @cancel="onCancel"
                    @submit="onSubmit"
                  />
                </v-row>
              </v-container>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Watch } from 'nuxt-property-decorator'

import { SET_TRANSACTION_STATUS } from '~/store/transactions/mutations'
import { SetUserTransactionStatusPayload } from '~/types'
import { APP_INFO } from '~/schemes/arweave-wallet'
import TransactionDialog from '../common/TransactionDialog.component.vue'

@Component
export default class UsernameDialog extends TransactionDialog<string> {
  valid = false
  dirty = false
  $refs!: {
    form: Vue & {
      validate: () => boolean
      resetValidation: () => void
    }
  }
  usernameErrors: string[] = []
  messages: string[] = []
  color: string = 'primary'
  isValidating: boolean | string = false

  @Watch('open') async onOpen() {
    await window.arweaveWallet.connect([
      'SIGN_TRANSACTION'
    ], APP_INFO)
    this.dirty = false
  }

  // Async validation of username
  @Watch('asset') async onUsernameChanged(username: string) {
    if (!this.dirty || !username) {
      return
    }

    this.isValidating = true
    this.messages = []
    this.color = 'primary'

    const result = await this.$usernameService.checkUsername(username, this.$auth.user.address)

    if (username !== this.asset) {
      this.isValidating = false
      return
    }

    switch (result.type) {
      case 'error':
      case 'exception':
        this.usernameErrors = [ result.errorMessage || '' ]
        break
      case 'ok':
      default:
        this.usernameErrors = []
        break
    }

    if (result.errorMessage === 'username already registered') {
      this.usernameErrors = [ 'you already registered this username!' ]
    }

    if (this.usernameErrors.length === 0) {
      this.messages = ['Available!']
      this.color = 'success'
    }

    this.isValidating = false
  }

  fetchOnServer = false
  async fetch() {
    if (this.$auth.user && this.$auth.user.address) {
      this.asset = await this.$usernameService.resolveUsername(
        this.$auth.user.address
      )
    }
  }

  created() {
    if (this.$auth.loggedIn) {
      this.$store.subscribe(async (mutation, _state) => {
        if (mutation.type === `transactions/${SET_TRANSACTION_STATUS}`) {
          const payload = mutation.payload as SetUserTransactionStatusPayload
          if (payload.status === 'CONFIRMED' && payload.type === 'username') {
            this.$fetch()
          }
        }
      })
    }
  }

  async onSubmit() {
    this.valid = this.$refs.form.validate()

    if (this.asset && this.valid) {
      this.isUploading = true

      const txId = await this.$usernameService.registerUsername(this.asset)

      if (txId) {
        const anchor = await this.$arweave.transactions.getTransactionAnchor()

        this.$accessor.transactions.queueTransaction({
          id: txId,
          last_tx: anchor,
          type: 'username',
          status: 'PENDING_CONFIRMATION',
          created: new Date().getTime()
        })
      } else {
        this.$toastService.error(
          'Could not register username: either you have an insufficient balance or the Gateway is unavailable'
        )
      }

      this.isUploading = false
      this.close()
    }
  }
}
</script>
