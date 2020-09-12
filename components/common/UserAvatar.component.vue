<template>
  <v-hover v-slot:default="hoverProps">
    <v-avatar :color="currentColor" :size="size">
      <template v-if="user.avatar">
        <v-img :src="'/avatar-images/' + user.avatar.source"></v-img>
      </template>
      <template v-else>
        <span class="white--text text-lowercase">
          {{ username }}
        </span>
      </template>
      <v-overlay :value="!disabled && hoverProps.hover">
        <v-file-input
          class="avatar-upload-button"
          accept="image/*"
          hide-input
          @change="onAvatarFileInputChanged"
          prepend-icon="mdi-camera"
        >
        </v-file-input>
      </v-overlay>
    </v-avatar>
  </v-hover>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'

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
  }) readonly small: boolean | undefined

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly disabled: boolean | undefined

  @Emit('onChange') onAvatarFileInputChanged(image: File) {
    return image
  }

  get currentColor() {
    if (this.user.avatar) {
      return 'white'
    } else {
      return this.color
    }
  }

  get username() {
    return this.small
      ? this.user.username[0]
      : this.user.username
  }

  get size() {
    return this.small
      ? '32'
      : '192'
  }
}
</script>

<style scoped>
.avatar-upload-button {
  margin-top: 6em;
  margin-left: 8px;
}
.avatar-upload-button >>> .v-input__control {
  display: none;
}
</style>
