<template>
  <v-dialog
    :value="open"
    persistent
    width="400"
  >
    <v-container dense class="pa-1">
      <v-row dense>
        <v-col dense cols="12" class="pa-0">
          <v-card>
            <v-card-text class="text-body-1 mb-0 pb-0 black--text">
              Like
              <b>{{ entityDescription }}</b>
              by
              <i>{{ ownerDisplayName }}</i>
              ?
              <p class="text-caption mb-0">
                (Includes {{ likeFee }} tip to {{ ownerDisplayName }})
              </p>
            </v-card-text>
            <v-card-actions>
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

import { DomainEntityCategory, Like } from '~/types'
import TransactionDialog from
  '~/components/common/TransactionDialog.component.vue'
import TransactionFormControls from
  '~/components/forms/transactionFormControls.component.vue'
import { LIKING_ARTIST_FEE } from '~/services/likes'

@Component({
  components: {
    TransactionFormControls
  }
})
export default class LikeDialog extends TransactionDialog<Like> {
  asset: Like = false
  type: DomainEntityCategory = 'like'
  likeFee = LIKING_ARTIST_FEE

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

  @Emit('pending') pending(isPending: boolean) {
    return isPending
  }

  async onSign() {
    this.isUploading = true

    this.info = 'Building Artwork transaction...'
    this.transaction = await this.$likesService.createLikeTransaction(
      this.entityTxId,
      this.entityOwner
    )

    this.info = 'Waiting on signature...'
    this.isSigned = await this.$arweaveService.sign(this.transaction)

    this.info = ''
    this.isUploading = false
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
    this.asset = false
    this.baseClose()
  }
}
</script>
