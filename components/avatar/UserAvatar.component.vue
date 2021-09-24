<template>
  <div class="user-avatar">
    <v-avatar :color="bgColor" :size="_size">
      <template v-if="user.avatar">
        <v-img :src="user.avatar.src"></v-img>
      </template>
      <template v-else>
        <nuxt-link
          v-if="dense"
          class="white--text avatar-username"
          :to="`/${fullUsername}`"
        >
          {{ username }}
        </nuxt-link>
        <span v-else class="white--text avatar-username">
          {{ username }}
        </span>
      </template>
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
            class="white--text text-truncate app-bar-username"
            :to="`/${fullUsername}`"
          >
            {{ fullUsername }}
          </nuxt-link>
        </span>
      </template>
      {{ fullUsername }}
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

import User from '~/models/user/user'
import { SET_TRANSACTION_STATUS } from '~/store/transactions/mutations'
import { SetUserTransactionStatusPayload } from '~/types'

@Component
export default class UserAvatar extends Vue {
  @Prop({
    type: Object,
    required: true
  }) readonly user!: User

  @Prop({
    type: String,
    required: false,
    default: 'indigo'
  }) readonly color!: string

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly dense: boolean | undefined

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly abbr: boolean | undefined

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly showUsername: boolean | undefined

  get bgColor() {
    if (this.user?.avatar?.src) {
      return 'transparent'
    } else {
      return this.color
    }
  }

  get username() {
    return this.abbr
      ? this.user.address[0]
      : this.user.address
  }

  get fullUsername() {
    return this.user.address
  }

  get _size() {
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
            const avatar = await this.$avatarService.fetchAvatar(
              this.$auth.user.address
            )
            this.$auth.setUser(Object.assign({}, this.$auth.user, { avatar }))
          }
        }
      })
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
.app-bar-username {
  max-width: 120px;
}
.avatar-username {
  word-break: break-word;
}
</style>
