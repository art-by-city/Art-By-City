<template>
  <div class="user-avatar">
    <v-avatar :color="bgColor" :size="_size">
      <template v-if="user.avatar">
        <v-img :src="user.avatar.src"></v-img>
      </template>
      <template v-else>
        <nuxt-link
          class="white--text avatar-username"
          :to="`/${fullUsername}`"
        >
          {{ username }}
        </nuxt-link>
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
            :class="`${textColor}--text text-truncate`"
            :style="`max-width: ${usernameWidth}`"
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

  get textColor() {
    if (this.dark) {
      return 'white'
    }

    return 'black'
  }

  get bgColor() {
    if (this.user?.avatar?.src) {
      return 'transparent'
    }

    return this.color
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
.avatar-username {
  word-break: break-word;
  text-decoration: none;
}
</style>
