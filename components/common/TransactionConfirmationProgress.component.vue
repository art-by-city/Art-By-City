<template>
  <div class="transaction-confirmation-progress">
    <span>Transaction found!  Waiting for confirmations...</span>
    <v-progress-linear height="25" v-model="confirmationsPct">
      {{ confirmations }} / {{ $config.arweave.waitForConfirmations }}
    </v-progress-linear>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from 'nuxt-property-decorator'

@Component
export default class TransactionConfirmationProgress extends Vue {
  @Prop({
    type: String,
    required: true
  }) txId!: string

  @Prop({
    type: Number,
    required: false,
    default: 5000
  }) sleep!: number

  confirmations: number = 0

  private timeout?: number

  @Emit('confirmed') onTransactionConfirmed() {
    return this.txId
  }

  @Emit('notFound') onTransactionNotFound() {
    return this.txId
  }

  get confirmationsPct(): number {
    return Math.floor(
      (this.confirmations / this.$config.arweave.waitForConfirmations) * 100
    )
  }

  created() {
    this.checkTransactionStatus()
  }

  destroyed() {
    if (typeof this.timeout === 'number') {
      clearInterval(this.timeout)
    }
  }

  private async checkTransactionStatus() {
    this.timeout = setTimeout(async () => {
      const txStatus = await this.$arweave.transactions.getStatus(this.txId)

      if (txStatus.status === 200 && txStatus.confirmed) {
        this.confirmations = txStatus.confirmed.number_of_confirmations

        const isConfirmed = this.confirmations >=
          this.$config.arweave.waitForConfirmations

        if (isConfirmed) {
          this.onTransactionConfirmed()
        } else {
          this.checkTransactionStatus()
        }
      } else {
        this.onTransactionNotFound()
      }
    }, this.sleep, this)
  }
}
</script>
