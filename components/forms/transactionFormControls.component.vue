<template>
  <v-container dense class="transaction-form-controls">
    <v-divider class="mb-2"></v-divider>
    <v-row dense justify="center" v-if="txTotal">
      <span v-if="txSize">
        {{ (Number.parseInt(txSize) / 1048576).toPrecision(5) }} <b>MB</b>
      </span>
      <span class="px-2" v-if="txSize">≈</span>
      <CurrencyEstimate :winston="txTotal" />
    </v-row>
    <v-row dense justify="center" v-if="txTotal">
      <b>Submit transaction?</b>
    </v-row>
    <v-row dense justify="center" v-if="info">
      <caption>{{ info }}</caption>
      <v-progress-linear
        v-if="pct || pct === 0"
        v-model="pct"
        stream
        buffer-value="0"
        height="24"
      >
        <template v-slot:default="{ value }">
          <strong>{{ Math.ceil(value) }}%</strong>
        </template>
      </v-progress-linear>
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

import { debounce } from '~/app/util'

@Component
export default class TransactionFormControls extends Vue {
  @Prop({
    type: Boolean,
    required: false
  }) readonly loading?: boolean

  @Prop({
    type: Boolean,
    required: false
  }) readonly disabled?: boolean

  @Prop({
    type: Boolean,
    required: false
  }) readonly signed?: boolean

  @Prop({
    type: Boolean,
    required: false
  }) readonly isContract?: boolean

  @Prop({
    type: String,
    required: false
  }) readonly txTotal?: string

  @Prop({
    type: String,
    required: false
  }) readonly txSize?: string

  @Prop({
    type: String,
    required: false
  }) readonly info?: string

  @Prop({
    type: Number,
    required: false
  }) readonly pct?: number

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
