<template>
  <div class="profile-edit-form">
    <v-dialog :value="showing" persistent max-width="300px">
      <v-card>
        <v-card-title>Edit Profile</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="_username"
            type="text"
            name="username"
            label="Username"
          ></v-text-field>
          <v-btn
            :color="checkUsernameButtonColor"
            :loading="usernameCheckInProgress"
            @click="onCheckUsernameClicked"
          >
            Check
          </v-btn>
          <template v-if="usernameChecked">
            <v-btn
              v-if="usernameValid"
              color="primary"
              :loading="usernameRegisterInProgress"
              @click="onRegisterUsernameClicked"
            >
              Register
            </v-btn>
            <span v-else color="error">{{ usernameMessage }}</span>
            <span v-if="usernameRegistrationSuccess">Registered!</span>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="onCloseClicked">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from 'nuxt-property-decorator'

import { debounce } from '~/helpers'

@Component
export default class ProfileEditForm extends Vue {
  usernameChecked: boolean = false
  usernameValid: boolean = false
  usernameCheckInProgress: boolean = false
  usernameMessage?: string
  usernameRegisterInProgress: boolean = false
  usernameRegistrationSuccess: boolean = false

  @PropSync('username', {
    type: String,
    required: true,
    default: ''
  }) _username!: string

  @PropSync('show', {
    type: Boolean,
    required: true,
    default: false
  }) showing!: boolean

  get checkUsernameButtonColor() {
    if (!this.usernameChecked) {
      return "primary"
    }

    if (this.usernameValid) {
      return "success"
    }

    return "error"
  }

  private reset() {
    this.usernameChecked = false
    this.usernameValid = false
    this.usernameCheckInProgress = false
    this.usernameMessage = undefined
    this.usernameRegisterInProgress = false
    this.usernameRegistrationSuccess = false
  }

  @debounce
  onCloseClicked() {
    this.showing = false
    this.reset()
  }

  @debounce
  async onCheckUsernameClicked() {
    this.usernameCheckInProgress = true
    this.usernameMessage = undefined
    this.usernameChecked = false
    this.usernameRegistrationSuccess = false
    try {
      const res = await this.$usernameService.checkUsername(this._username)
      this.usernameChecked = true
      if (res.type === 'ok') {
        this.usernameValid = true
      } else {
        this.usernameValid = false
        this.usernameMessage = res.result?.toString() || ''
      }
    } catch (error) {
      console.error(error)
      this.$toastService.error(error)
    } finally {
      this.usernameCheckInProgress = false
    }
  }

  @debounce
  async onRegisterUsernameClicked() {
    this.usernameRegisterInProgress = true

    try {
      const res = await this.$usernameService.registerUsername(this._username)
      console.log('username registration res', res)
      if (res.type === 'ok') {
        this.usernameRegistrationSuccess = true
      } else {
        this.$toastService.error(res.result?.toString() || '')
      }
    } catch (error) {
      console.error(error)
      this.$toastService.error(error)
    } finally {
      this.usernameRegisterInProgress = false
    }
  }
}
</script>
