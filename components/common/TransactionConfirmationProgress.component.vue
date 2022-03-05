<template>
  <v-container fluid class="transaction-confirmation-progress pa-0">
    <v-row dense>
      <v-col cols="12">
        <span class="font-italic text-caption">{{ utx.id }}</span>
      </v-col>
    </v-row>
    <v-row dense align="center">
      <v-col cols="auto">
        <v-icon>mdi-progress-upload</v-icon>
      </v-col>
      <v-col cols="10">
        <v-row dense align="center">
          <strong>Status:&nbsp;</strong>
          <span v-if="utx.status === 'PENDING_SUBMISSION'">
            Pending Submission
          </span>
          <span v-if="utx.status === 'PENDING_CONFIRMATION'">
            Pending Confirmation
          </span>
          <template v-if="utx.status === 'DROPPED'">
            <v-col cols="auto" class="pa-0">
              <span>Dropped</span>
            </v-col>
            <v-spacer></v-spacer>
            <!-- <v-col cols="auto">
              <v-btn
                outlined
                elevation="2"
                color="primary"
                @click="onResubmitClicked"
              >
                Resubmit
              </v-btn>
            </v-col> -->
          </template>
          <span v-if="utx.status === 'CONFIRMING'">Confirming</span>
          <span v-if="utx.status === 'CONFIRMED'">Ready!</span>
        </v-row>
        <v-row dense v-if="utx.status === 'CONFIRMING'">
          <v-progress-linear :value="confirmationsPct" height="25">
            {{ confirmations }} / {{ $config.arweave.waitForConfirmations }}
          </v-progress-linear>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'

import { UserTransaction } from '~/types'

@Component
export default class TransactionConfirmationProgress extends Vue {
  @Prop({
    type: Object,
    required: true
  }) utx!: UserTransaction

  numConfirmations?: number

  @Emit('confirmed') onConfirmed() {}

  get confirmations(): number {
    return this.numConfirmations || this.utx.confirmations || 0
  }

  get confirmationsPct(): number {
    return Math.floor(
      (this.confirmations / this.$config.arweave.waitForConfirmations) * 100
    )
  }

  created() {
    this.$nuxt.$on(
      'artwork-CONFIRMED',
      async ({ id, confirmations }: { id: string, confirmations: number }) => {
        if (id === this.utx.id) {
          this.numConfirmations = confirmations

          if (confirmations === this.$config.arweave.waitForConfirmations) {
            this.onConfirmed()
          }
        }
      }
    )
  }

  // @debounce
  // onResubmitClicked() {
  //   this.$accessor.transactions.updateStatus({
  //     id: this.utx.id,
  //     status: 'PENDING_SUBMISSION',
  //     type: this.utx.type
  //   })
  // }
}
</script>
