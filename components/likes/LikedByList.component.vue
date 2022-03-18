<template>
  <div class="liked-by-list">
    <template v-for="({ address }, i) in likesAndTips">
      <v-divider v-if="i > 0"></v-divider>
      <UserAvatar :key="i" dense :user="{ address }" usernameWidth="298px" />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class LikedByList extends Vue {
  likesAndTips: {
    address: string,
    amount: string,
    txId: string
  }[] = []

  @Prop({
    type: String,
    required: true
  }) readonly entityTxId!: string

  @Prop({
    type: String,
    required: true
  }) readonly entityOwner!: string

  async fetch() {
    this.likesAndTips = await this.$likesService.fetchLikedBy(
      this.entityTxId,
      this.entityOwner
    )
  }
}
</script>
