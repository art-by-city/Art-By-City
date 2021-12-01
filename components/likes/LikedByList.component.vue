<template>
  <div class="liked-by-list">
    <template v-for="(user, i) in users">
      <v-divider v-if="i > 0"></v-divider>
      <UserAvatar :key="i" abbr dense :user="user" usernameWidth="298px" />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { User } from '~/models'

@Component
export default class LikedByList extends Vue {
  users: User[] = []

  @Prop({
    type: String,
    required: true
  }) readonly entityTxId!: string

  async fetch() {
    const users = await this.$likesService.fetchLikedBy(this.entityTxId)

    for (let i = 0; i < users.length; i++) {
      users[i].avatar = await this.$avatarService.fetchAvatar(users[i].address)
    }

    this.users = users
  }
}
</script>
