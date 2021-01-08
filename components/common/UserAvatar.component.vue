<template>
  <v-hover v-slot:default="hoverProps">
    <v-avatar :color="currentColor" :size="size">
      <template v-if="user.avatar">
        <v-img :src="baseUrl + user.avatar.source"></v-img>
      </template>
      <template v-else>
        <span class="white--text text-lowercase">
          {{ username }}
        </span>
      </template>
      <v-overlay :value="editable && hoverProps.hover">
        env: {{ env }}
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
  env = process.env.env

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
  }) readonly abbr: boolean | undefined

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly editable: boolean | undefined

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
    return this.abbr
      ? this.user.username[0]
      : this.user.username
  }

  get size() {
    return this.small
      ? '32'
      : '192'
  }

  get baseUrl() {
    return process.env.env === 'staging' || process.env.env === 'production'
      ? `https://storage.googleapis.com/${process.env.USER_UPLOAD_BUCKET_NAME}/avatar-images/`
      : '/avatar-images/'
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
