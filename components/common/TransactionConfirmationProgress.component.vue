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
        <v-row dense>
          <strong>Status:&nbsp;</strong>
          <span v-if="tx.status === 'PENDING_SUBMISSION'">
            Pending Submission
          </span>
          <span v-if="tx.status === 'PENDING_CONFIRMATION'">
            Pending Confirmation
          </span>
          <span v-if="tx.status === 'DROPPED'">Dropped</span>
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
}
</script>
