<template>
  <div class="user-avatar">
    <v-avatar color="transparent" :size="size">
      <nuxt-link :to="`/${username || user.address}`" class="mb-n1">
        <v-img :src="src" aspect-ratio="1" :width="size">
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
            :to="`/${username || user.address}`"
          >
            {{ displayName }}
          </nuxt-link>
        </span>
      </template>
      {{ displayName }}
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import MD5 from 'crypto-js/md5'

import User from '~/models/user/user'
import { Profile } from '~/types'

@Component
export default class UserAvatar extends Vue {
  @Prop({
    type: Object,
    required: true
  }) readonly user!: User

  src: string = ''
  username: string | null = null
  profile: Profile | null = null

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

  get displayName() {
    if (this.profile?.displayName) {
      return this.profile?.displayName
    }

    if (this.username) {
      return `@${this.username}`
    }

    return this.user.address || ''
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

  get isOwner() {
    return this.$auth.loggedIn && this.$auth.user.address === this.user.address
  }

  created() {
    this.$nuxt.$on('avatar-CONFIRMED', async () => {
      if (this.isOwner) {
        const avatar = await this.$avatarService.fetchAvatar(this.user.address)

        if (avatar) {
          this.src = avatar.src
        }
      }
    })
    this.$nuxt.$on('username-CONFIRMED', async () => {
      if (this.isOwner) {
        this.username = await this.$usernameService.resolveUsername(
          this.user.address
        )
      }
    })
    this.$nuxt.$on('profile-CONFIRMED', async () => {
      if (this.isOwner) {
        await this.fetchAndSetProfile()
      }
    })
  }

  fetchOnServer = false
  async fetch() {
    await this.fetchAndSetAvatar()
    await this.fetchAndSetProfile()
    this.username = this.user.username || null
  }

  async fetchAndSetProfile() {
    this.profile = await this.$profileService.fetchProfile(this.user.address)
  }

  async fetchAndSetAvatar() {
    let avatar = this.user.avatar

    if (!avatar) {
      avatar = await this.$avatarService.fetchAvatar(this.user.address)
    }

    if (avatar && avatar.src) {
      this.src = avatar.src

      // Check for old format avatar and ask user to update
      if (this.isOwner && !this.dense && avatar.src.startsWith('data:image')) {
        this.$toastService.warning(
          'Your avatar is using an old data format and needs to be republished'
        )
      }
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
