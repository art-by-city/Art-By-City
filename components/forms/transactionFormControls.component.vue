<template>
  <v-container dense class="transaction-form-controls">
    <v-divider class="mb-2"></v-divider>
    <v-row dense justify="center" v-if="txTotal">
      ~&nbsp;<span>{{ humanReadableTxTotal }}</span>&nbsp;AR
    </v-row>
    <v-row dense justify="center" v-if="txTotal">
      <b>Submit transaction?</b>
    </v-row>
    <v-row dense justify="center">
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
      <v-col cols="12" sm="auto" order="3" order-sm="3" class="center-text">
        <v-btn
          outlined
          elevation="2"
          color="primary"
          :disabled="loading || disabled"
          :loading="loading"
          @click="onSubmitOrSignedClicked"
        >
          {{ continueButtonText }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'

import { debounce } from '~/helpers'

@Component
export default class TransactionFormControls extends Vue {
  @Prop({
    type: Boolean,
    required: false
  }) loading?: boolean

  @Prop({
    type: Boolean,
    required: false
  }) disabled?: boolean

  @Prop({
    type: Boolean,
    required: false
  }) signed?: boolean

  @Prop({
    type: Boolean,
    required: false
  }) isContract?: boolean

  @Prop({
    type: String,
    required: false
  }) txTotal?: string

  get humanReadableTxTotal() {
    if (this.txTotal) {
      return this.$arweave.ar.winstonToAr(this.txTotal, {
        decimals: 8
      })
    }

    return ''
  }

  get continueButtonText() {
    if (this.isContract) {
      return this.signed ? 'Sign & Submit' : 'Confirm'
    }

    return this.signed ? 'Submit' : 'Sign'
  }

  onSubmitOrSignedClicked() {
    if (this.signed) {
      this.onSubmitClicked()
    } else {
      this.onSignClicked()
    }
  }

  @debounce
  @Emit('cancel') onCancelClicked() {}

  @debounce
  @Emit('submit') onSubmitClicked() {}

  @debounce
  @Emit('sign') onSignClicked() {}
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
