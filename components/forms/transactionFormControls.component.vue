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
      <v-col cols="12" sm="auto" order="3" order-sm="3" class="center-text">
        <v-btn
          outlined
          elevation="2"
          color="primary"
          :disabled="loading || disabled"
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

  @debounce
  @Emit('cancel') onCancelClicked() {}

  @debounce
  @Emit('submit') onSubmitClicked() {}
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
