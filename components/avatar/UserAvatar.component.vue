<template>
  <div class="user-avatar">
    <v-avatar color="transparent" :size="size">
      <nuxt-link :to="`/${username}`">
        <v-img :src="src">
          <template v-slot:placeholder>
            <TransactionPlaceholder :txId="user.address" />
          </template>
        </v-img>
      </nuxt-link>
    </v-avatar>

    <v-tooltip bottom v-if="dense">
      <template v-slot:activator="{ on, attrs }">
        <span
          v-bind="attrs"
          v-on="on"
          class="ml-2"
          style="display: inline-flex;"
        >
          <nuxt-link
            :class="`${dark ? 'white' : 'black'}--text text-truncate`"
            :style="`max-width: ${usernameWidth}`"
            :to="`/${username}`"
          >
            {{ username }}
          </nuxt-link>
        </span>
      </template>
      {{ username }}
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import MD5 from 'crypto-js/md5'

import User from '~/models/user/user'
import { SET_TRANSACTION_STATUS } from '~/store/transactions/mutations'
import { SetUserTransactionStatusPayload } from '~/types'

@Component
export default class UserAvatar extends Vue {
  @Prop({
    type: Object,
    required: true
  }) readonly user!: User

  src: string = ''

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly dense: boolean | undefined

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly dark: boolean | undefined

  @Prop({
    type: String,
    required: false,
    default: '100%'
  }) readonly usernameWidth!: string

  get username() {
    return this.user.address
  }

  get size() {
    if (this.dense) {
      return 32
    }

    switch (this.$vuetify.breakpoint.name) {
      case 'xs': return 128
      case 'sm':
      case 'md':
      case 'lg':
      case 'xl':
        default: return 192
    }
  }

  created() {
    if (this.$auth.loggedIn && this.user.address === this.$auth.user.address) {
      this.$store.subscribe(async (mutation, _state) => {
        if (mutation.type === `transactions/${SET_TRANSACTION_STATUS}`) {
          const payload = mutation.payload as SetUserTransactionStatusPayload
          if (payload.status === 'CONFIRMED' && payload.type === 'avatar') {
            this.$fetch()
          }
        }
      })
    }
  }

  fetchOnServer = false
  async fetch() {
    const avatar = await this.$avatarService.fetchAvatar(this.user.address)

    if (avatar) {
      this.src = avatar.src
    } else {
      const gravatarBase = 'https://www.gravatar.com/avatar'
      const userAddrHash = MD5(this.user.address.toLowerCase())

      this.src = `${gravatarBase}/${userAddrHash}?f=y&d=identicon&s=${this.size}`
    }
  }
}
</script>

<style scoped>
.avatar-upload-button {
  margin-top: 6em;
}
.avatar-upload-button.v-text-field {
  padding-top: 0px;
}
.avatar-upload-button >>> .v-input__control {
  display: none;
}
.avatar-upload-button >>> .v-input__prepend-outer {
  margin-right: 0px;
  margin-left: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
}
</style>
