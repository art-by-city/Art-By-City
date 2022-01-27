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
            <v-card-title>Edit Profile</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-form ref="form" v-model="valid" autocomplete="off">
                <v-text-field
                  v-model="asset.displayName"
                  type="text"
                  name="displayName"
                  label="Display Name"
                  counter="50"
                  :rules="[displayNameRules]"
                ></v-text-field>

                <v-textarea
                  v-model="asset.bio"
                  name="bio"
                  label="Bio"
                  rows="5"
                  counter="1024"
                  :rules="[bioRules]"
                ></v-textarea>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <TransactionFormControls
                :loading="isUploading"
                @cancel="onCancel"
                @submit="onSubmit"
              />
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'

import { Profile, UserTransaction } from '~/types'
import { maxLength } from '~/helpers/rules'
import TransactionDialog from
  '~/components/common/TransactionDialog.component.vue'
import TransactionFormControls from
  '~/components/forms/transactionFormControls.component.vue'
import { SET_TRANSACTION_STATUS } from '~/store/transactions/mutations'
import { SetUserTransactionStatusPayload } from '~/types'
import { PermissionType } from 'arconnect'

@Component({
  components: {
    TransactionFormControls
  }
})
export default class EditProfileDialog extends TransactionDialog {
  asset: Profile = {}
  valid = false
  $refs!: {
    form: Vue & {
      validate: () => boolean
      resetValidation: () => void
    }
  }

  get displayNameRules() {
    return maxLength(50)
  }
  get bioRules() {
    return maxLength(1024)
  }

  fetchOnServer = false
  async fetch() {
    if (this.$auth.user && this.$auth.user.address) {
      const profile = await this.$profileService.fetchProfile(
        this.$auth.user.address
      )

      if (profile) {
        this.asset = profile
      }
    }
  }

  created() {
    if (this.$auth.loggedIn) {
      this.$store.subscribe(async (mutation, _state) => {
        if (mutation.type === `transactions/${SET_TRANSACTION_STATUS}`) {
          const payload = mutation.payload as SetUserTransactionStatusPayload
          if (payload.status === 'CONFIRMED' && payload.type === 'profile') {
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

      const transaction = await this.$profileService.createProfileTransaction(
        this.asset
      )

        // TODO -> Extend TokenableSchemeOptions and add these
        const APP_INFO = {
          name: 'Art x By x City',
          logo: 'logo/logo_by_daliah_ammar_square.png'
        }

        // TODO -> Extend TokenableSchemeOptions and add these
        const APP_PERMISSIONS = [
          'ACCESS_ADDRESS',
          'ACCESS_PUBLIC_KEY',
          'SIGNATURE',
          'SIGN_TRANSACTION'
        ]
        console.log('CONNECTING')
        await window.arweaveWallet.connect(
          APP_PERMISSIONS as PermissionType[],
          APP_INFO
        )
        console.log('CONNECTED')

      const signed = await this.$arweaveService.sign(transaction)

      if (signed) {
        const tx: UserTransaction = {
          transaction,
          type: 'profile',
          status: 'PENDING_CONFIRMATION',
          created: new Date().getTime()
        }

        this.$txQueueService.submitUserTransaction(tx, (err?: Error) => {
          if (err) {
            this.$toastService.error(err.message)
            this.isUploading = false
          } else {
            this.close()
          }
        })
      } else {
        this.isUploading = false
      }
    }
  }

  close() {
    this.open = false
    this.asset = {}
    this.isUploading = false
  }
}
</script>
