<template>
  <div class="transaction-confirmation-progress">
    <div class="font-italic">{{ txId }}</div>
    <template v-if="status">
      <strong>Status:&nbsp;</strong>
      <span v-if="status === 404">Not found</span>
      <span v-if="status === 202">Pending</span>
      <span v-if="status === 200 && !isTxConfirmed">Confirming</span>
      <span v-if="status === 200 && isTxConfirmed">Ready!</span>
    </template>
    <template v-else>
      <span>Fetching tx...</span>
    </template>
    <v-progress-linear
      v-if="status === 200"
      height="25"
      v-model="confirmationsPct"
    >
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
  status: 404 | 202 | 200 | null = null

  private timeout?: number

  @Emit('confirmed') onTransactionConfirmed() {
    return this.txId
  }

  @Emit('notFound') onTransactionNotFound() {
    return this.txId
  }

  get isTxConfirmed(): boolean {
    return this.confirmations >= this.$config.arweave.waitForConfirmations
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
        this.status = 200

        const isConfirmed = this.confirmations >=
          this.$config.arweave.waitForConfirmations

        if (isConfirmed) {
          this.onTransactionConfirmed()
        } else {
          this.checkTransactionStatus()
        }
      } else if (txStatus.status === 202) {
        this.status = 202
        this.checkTransactionStatus()
      } else {
        this.status = 404
        this.onTransactionNotFound()
      }
    }, this.sleep, this)
  }
}
</script>
