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
              Like
              <b>{{ entityDescription }}</b>
              by
              <i>{{ ownerDisplayName }}</i>
              ?
              <p class="text-caption mt-1 mb-0">
                Includes {{ likeFee }} <b>AR</b> tip to
                <i>{{ ownerDisplayName }}</i>
                <span>({{ usdEstimate }})</span>
                <v-btn
                  v-if="!isEditingTip"
                  text
                  outlined
                  x-small
                  @click="isEditingTip = true"
                  class="ml-1"
                >
                  Edit
                </v-btn>
              </p>
              <v-form
                ref="form"
                v-model="valid"
                autocomplete="off"
                :disabled="isUploading || isSigned"
              >
                <v-text-field
                  v-if="isEditingTip"
                  type="number"
                  v-model="likeFee"
                  dense
                  prefix="AR"
                  :suffix="usdEstimate"
                  :step="LIKING_ARTIST_FEE"
                  :min="LIKING_ARTIST_FEE"
                  :rules="[minimumTip]"
                >
                  {{ likeFee }}
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
import { Component, Prop, Emit } from 'nuxt-property-decorator'
import _ from 'lodash'

import { DomainEntityCategory, Like } from '~/types'
import TransactionDialog from
  '~/components/common/TransactionDialog.component.vue'
import TransactionFormControls from
  '~/components/forms/transactionFormControls.component.vue'
import { LIKING_ARTIST_FEE } from '~/services/likes'
import { convertARtoUSD } from '~/helpers'

@Component({
  components: {
    TransactionFormControls
  }
})
export default class LikeDialog extends TransactionDialog<Like> {
  asset: Like = false
  type: DomainEntityCategory = 'like'

  @Prop({
    type: String,
    required: true
  }) entityTxId!: string

  @Prop({
    type: String,
    required: true
  }) entityOwner!: string

  @Prop({
    type: String,
    required: true
  }) entityDescription!: string

  @Prop({
    type: String,
    required: true
  }) ownerDisplayName!: string

  info: string = ''

  LIKING_ARTIST_FEE = LIKING_ARTIST_FEE
  likeFee: string = LIKING_ARTIST_FEE
  isEditingTip: boolean = false
  valid: boolean = true
  $refs!: {
    form: Vue & {
      validate: () => boolean
      resetValidation: () => void
    }
  }

  @Emit('pending') pending(isPending: boolean) {
    return isPending
  }

  minimumTip(value: string = '') {
    const valueFloat = Number.parseFloat(value)
    const feeFloat = Number.parseFloat(LIKING_ARTIST_FEE)

    if (!value || _.isNaN(valueFloat) || valueFloat < feeFloat) {
      return `Tip must be at least ${LIKING_ARTIST_FEE} AR.`
    }

    return true
  }

  async onSign() {
    this.valid = this.$refs.form.validate()

    if (this.valid) {
      this.isUploading = true

      this.info = 'Building Like transaction...'
      this.transaction = await this.$likesService.createLikeTransaction(
        this.entityTxId,
        this.entityOwner,
        this.likeFee
      )

      this.info = 'Waiting on signature...'
      this.isSigned = await this.$arweaveService.sign(this.transaction)

      this.info = ''
      this.isUploading = false
    }
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
          created: new Date().getTime(),
          target: this.entityOwner,
          entityId: this.entityTxId
        },
        (err?: Error) => {
          if (err) {
            this.$toastService.error(err.message)
            this.isUploading = false
            this.pending(false)
          } else {
            this.pending(true)
            this.close()
          }
        }
      )
    }
  }

  close() {
    this.isEditingTip = false
    this.asset = false
    this.likeFee = LIKING_ARTIST_FEE
    this.baseClose()
  }

  get usdEstimate(): string {
    if (this.likeFee && this.$priceService.priceUSD) {
      return '≈ ' + convertARtoUSD(
        this.likeFee,
        this.$priceService.priceUSD
      )
    }

    return ''
  }
}
</script>

<style scoped>
/* Hide slider messages to make dialog smaller */
.v-input__slider >>> .v-messages {
  display: none;
}
.v-input__slider >>> .v-input__slot {
  margin-bottom: 5px !important;
}
</style>
