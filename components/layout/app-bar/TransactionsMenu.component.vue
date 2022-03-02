<template>
  <v-menu
    offset-y
    left
    tile
    :value="open"
    max-height="80vh"
    min-width="400"
    content-class="transactions-menu"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon tile x-large v-on="on" v-bind="attrs">
        <v-badge
          :color="badgeColor"
          :content="txs.length.toString()"
          :class="{ 'badge-text-black': badgeColor === 'yellow' }"
          overlap
          bottom
          :value="txs.length > 0"
        >
          <v-img
            contain
            width="32px"
            class="dark-svg"
            :class="{ 'spin': shouldIconAnimate }"
            src="/icons/transfer.svg"
          />
        </v-badge>
      </v-btn>
    </template>
    <v-list dense>
      <v-row class="ma-2">
        <v-col cols="auto">
          <span class="text-h5">My Transactions</span>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <!-- <v-btn small outlined elevation="2" to="/transactions">
            View All
          </v-btn> -->
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <template v-for="(tx, i) in txs">
        <v-lazy transition="fade-transition">
          <v-list-item
            :key="i"
            dense
          >
            <v-list-item-content>
              <TransactionConfirmationProgress :utx="tx" />
            </v-list-item-content>
          </v-list-item>
        </v-lazy>
      </template>
      <v-list-item v-if="txs.length === 0">
        <v-list-item-content>No pending transactions.</v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

import TransactionConfirmationProgress from
  '~/components/common/TransactionConfirmationProgress.component.vue'
import { UserTransaction } from '~/types'

@Component({
  components: {
    TransactionConfirmationProgress
  }
})
export default class TransactionsMenu extends Vue {
  open: boolean = false

  get txs(): UserTransaction[] {
    return this.$accessor.transactions.listProcessing
  }

  get badgeColor(): string {
    let hasDroppedTx = false, hasPendingTx = false, hasConfirmingTx = false
    for (let i = 0; i < this.txs.length; i++) {
      const tx = this.txs[i]

      switch (tx.status) {
        case 'DROPPED':
          hasDroppedTx = true
          break
        case 'PENDING_SUBMISSION':
        case 'PENDING_CONFIRMATION':
          hasPendingTx = true
          break
        case 'CONFIRMING':
          hasConfirmingTx = true
          break
      }
    }

    if (hasDroppedTx) {
      return 'red'
    } else if (hasPendingTx) {
      return 'yellow'
    } else if (hasConfirmingTx) {
      return 'green'
    }

    return 'white'
  }

  get shouldIconAnimate(): boolean {
    if (this.txs.length < 1) {
      return false
    }

    if (this.txs.every((tx) => tx.status === 'DROPPED')) {
      return false
    }

    return true
  }
}
</script>

<style scoped>
/* NB: Change SVG color -> https://stackoverflow.com/a/53336754 */
.dark-svg {
  filter:
    invert(100%)
    sepia(0%)
    saturate(0%)
    hue-rotate(335deg)
    brightness(101%)
    contrast(104%);
}

.spin {
  -webkit-animation: spin 2s linear infinite;
  -moz-animation:    spin 2s linear infinite;
  animation:         spin 2s linear infinite;
}
@-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
@-moz-keyframes    spin { 100% { -moz-transform:    rotate(360deg); } }
@keyframes         spin { 100% { transform:         rotate(360deg); } }

.badge-text-black >>> .v-badge__badge {
  color: black;
}
</style>
