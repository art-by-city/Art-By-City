<template></template>

<script lang="ts">
import { Vue, Component, PropSync } from 'nuxt-property-decorator'
import Transaction from 'arweave/web/lib/transaction'

import { debounce } from '~/app/util'
import { DomainEntityCategory } from '~/types'
import TransactionFormControls from
  '~/components/forms/transactionFormControls.component.vue'

@Component({
  components: {
    TransactionFormControls
  }
})
export default class TransactionDialog<T> extends Vue {
  isUploading: boolean = false
  isSigned: boolean = false
  isDirty: boolean = false
  asset: T | null = null
  type!: DomainEntityCategory
  transaction: Transaction | null = null

  get txTotal() {
    if (this.transaction) {
      return this.$arweave.ar.add(
        this.transaction.reward,
        this.transaction.quantity
      )
    }

    return undefined
  }

  @PropSync('show', {
    type: Boolean,
    required: false
  }) open?: boolean

  baseClose() {
    this.open = false
    this.isUploading = false
    this.isSigned = false
    this.transaction = null
  }

  close() {
    this.baseClose()
  }

  @debounce
  onCloseDialog() {
    if (!this.isUploading) {
      this.close()
    }
  }

  onCancel() {
    this.close()
  }

  async onSubmit() {
    if (this.isSigned && this.transaction) {
      this.isUploading = true
      this.$txQueueService.submitUserTransaction(
        this.transaction,
        {
          id: this.transaction.id,
          last_tx: this.transaction.last_tx,
          type: this.type,
          status: 'PENDING_SUBMISSION',
          created: new Date().getTime()
        },
        (err?: Error) => {
          if (err) {
            this.$toasts.error(err.message)
            this.isUploading = false
          } else {
            this.close()
          }
        }
      )
    }
  }
}
</script>
