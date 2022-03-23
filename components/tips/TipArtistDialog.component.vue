<template>
  <v-dialog
    :value="open"
    persistent
    width="400"
    class="overflow-x-hidden"
  >
    <v-container dense class="pa-1">
      <v-row dense>
        <v-col dense cols="12" class="pa-0">
          <v-card>
            <v-card-text
              class="
                text-body-1
                mb-0
                pb-0
                black--text
                overflow-x-hidden
                overflow-y-hidden
              "
            >
              Send {{ asset.amount }} <b>AR</b> tip to
              <i>{{ recipientDisplayName }}</i> ?
              <v-form
                ref="form"
                v-model="valid"
                autocomplete="off"
                :disabled="isUploading || isSigned"
              >
                <v-text-field
                  type="number"
                  v-model="asset.amount"
                  dense
                  :step="MIN_TIP"
                  :min="MIN_TIP"
                  :rules="[minimumTip]"
                >
                  {{ asset.amount }}
                </v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions class="pt-0">
              <TransactionFormControls
                :loading="isUploading"
                :signed="isSigned"
                :txTotal="txTotal"
                :info="info"
                @sign="onSign"
                @submit="onSubmit"
                @cancel="onCancel"
              />
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<script lang="ts">
import _ from 'lodash'
import { Component, Prop } from 'nuxt-property-decorator'

import { DomainEntityCategory, Tip } from '~/types'
import TransactionDialog from '../common/TransactionDialog.component.vue'

@Component({})
export default class TipArtistDialog extends TransactionDialog<Partial<Tip>> {
  readonly MIN_TIP: string = '0.0001'
  asset: Partial<Tip> = {
    amount: this.MIN_TIP,
    from: this.$auth.user?.address || ''
  }
  type: DomainEntityCategory = 'tip'
  info: string = ''
  valid: boolean = true
  $refs!: {
    form: Vue & {
      validate: () => boolean
      resetValidation: () => void
    }
  }

  @Prop({
    type: String,
    required: true
  }) recipientAddress!: string

    @Prop({
    type: String,
    required: true
  }) recipientDisplayName!: string

  minimumTip(value: string = '') {
    const valueFloat = Number.parseFloat(value)
    const feeFloat = Number.parseFloat(this.MIN_TIP)

    if (!value || _.isNaN(valueFloat) || valueFloat < feeFloat) {
      return `Tip must be at least ${this.MIN_TIP} AR.`
    }

    return true
  }

  async onSign() {
    this.valid = this.$refs.form.validate()

    if (this.valid) {
      this.isUploading = true

      this.info = 'Building Tip transaction...'
      this.transaction = await this.$tipsService.createTipTransaction(
        this.recipientAddress,
        this.asset as Tip
      )

      this.info = 'Waiting on signature...'
      this.isSigned = await this.$arweaveService.sign(this.transaction)

      this.info = ''
      this.isUploading = false
    }
  }

  close() {
    this.baseClose()
  }
}
</script>
