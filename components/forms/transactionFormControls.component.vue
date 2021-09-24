<template>
  <v-container dense>
    <v-row dense justify="center" class="transaction-form-controls">
      <v-col cols="12" sm="auto" order="2" order-sm="1" class="center-text">
        <v-btn
          outlined
          elevation="2"
          color="error"
          :disabled="loading"
          @click="onCancelClicked"
        >
          Cancel
        </v-btn>
      </v-col>
      <v-col cols="12" sm="auto" order="1" order-sm="2" class="center-text">
        <v-chip outlined>{{ estimate }}</v-chip>
      </v-col>
      <v-col cols="12" sm="auto" order="3" order-sm="3" class="center-text">
        <v-btn
          outlined
          elevation="2"
          color="primary"
          :disabled="loading"
          :loading="loading"
          @click="onSubmitClicked"
        >
          Submit
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'nuxt-property-decorator'
import Transaction from 'arweave/node/lib/transaction'

import { debounce } from '~/helpers'

@Component
export default class TransactionFormControls extends Vue {
  estimate: string = '...'

  @Prop({
    type: Object,
    required: false
  }) transaction?: Transaction

  @Prop({
    type: Boolean,
    required: false
  }) loading?: boolean

  @Watch('transaction', {
    deep: true,
    immediate: true
  }) async onTransactionChanged(tx?: Transaction) {
    if (tx) {
      const price = this.$arweave.ar.winstonToAr(tx.reward, {
        decimals: 6
      })
      this.estimate = `≈ ${price} AR`
    }
  }

  @debounce
  @Emit('cancel') onCancelClicked() {}

  @debounce
  @Emit('submit') onSubmitClicked() {
    return this.transaction
  }
}
</script>

<style scoped>
.transaction-form-controls {
  width: 100%;
}
.center-text {
  text-align: center;
}
</style>
