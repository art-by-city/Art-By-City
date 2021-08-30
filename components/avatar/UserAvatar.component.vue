<template>
  <div class="user-avatar">
    <v-avatar :color="color" :size="_size">
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
