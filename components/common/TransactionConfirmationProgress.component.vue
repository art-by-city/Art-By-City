<template>
  <v-container fluid class="transaction-confirmation-progress pa-0">
    <v-row dense>
      <v-col cols="12">
        <span class="font-italic text-caption">{{ tx.transaction.id }}</span>
      </v-col>
    </v-row>
    <v-row dense align="center">
      <v-col cols="auto">
        <v-icon>mdi-progress-upload</v-icon>
      </v-col>
      <v-col cols="10">
        <v-row dense align="center">
          <strong>Status:&nbsp;</strong>
          <span v-if="tx.status === 'PENDING_SUBMISSION'">
            Pending Submission
          </span>
          <span v-if="tx.status === 'PENDING_CONFIRMATION'">
            Pending Confirmation
          </span>
          <template v-if="tx.status === 'DROPPED'">
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
          <span v-if="tx.status === 'CONFIRMING'">Confirming</span>
          <span v-if="tx.status === 'CONFIRMED'">Ready!</span>
        </v-row>
        <v-row dense v-if="tx.status === 'CONFIRMING'">
          <v-progress-linear v-model="confirmationsPct" height="25">
            {{ confirmations }} / {{ $config.arweave.waitForConfirmations }}
          </v-progress-linear>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

import { UserTransaction } from '~/types'
import { debounce } from '~/helpers'

@Component
export default class TransactionConfirmationProgress extends Vue {
  @Prop({
    type: Object,
    required: true
  }) tx!: UserTransaction

  get confirmations(): number {
    return this.tx.confirmations || 0
  }

  get confirmationsPct(): number {
    return Math.floor(
      (this.confirmations / this.$config.arweave.waitForConfirmations) * 100
    )
  }

  @debounce
  onResubmitClicked() {
    this.$accessor.transactions.updateStatus({
      id: this.tx.transaction.id,
      status: 'PENDING_SUBMISSION',
      type: this.tx.type
    })
  }
}
</script>
