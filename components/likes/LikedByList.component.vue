<template>
  <div class="liked-by-list">
    <v-list class="py-0">
      <span>
        <b>Total</b>&nbsp;
        <CurrencyEstimate :winston="totalWinston" />
      </span>
      <template v-for="({ from, amount, txId }, i) in likesAndTips">
        <v-divider v-if="i >= 1"></v-divider>
        <v-list-item :key="i" dense>
          <v-list-item-content>
            <v-list-item-title>
              <UserAvatar
                dense
                :user="{ address: from }"
                username-width="240px"
              />
            </v-list-item-title>
            <v-list-item-subtitle>
              <CurrencyEstimate class="text-caption" :winston="amount" />
              <a
                class="text-caption"
                :href="`https://viewblock.io/arweave/tx/${txId}`"
                target="_blank"
              >
                <div class="text-truncate">{{ txId }}</div>
              </a>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { FeedItem, LikeWithTip } from '~/app/core'

@Component
export default class LikedByList extends Vue {
  likesAndTips: (FeedItem & LikeWithTip)[] = []

  @Prop({
    type: String,
    required: true
  }) readonly entityTxId!: string

  @Prop({
    type: String,
    required: true
  }) readonly entityOwner!: string

  get totalWinston() {
    return this.likesAndTips
      .map(item => item.amount)
      .reduce((sum, amount) => this.$arweave.ar.add(sum, amount), '0')
  }

  async fetch() {
    this.likesAndTips = await this.$likesService.fetchLikedBy(
      this.entityTxId,
      this.entityOwner
    )
  }
}
</script>

<style scoped>
.adjust-icon {
  margin-top: -2px;
}
</style>
