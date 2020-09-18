<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="4">
        <v-card>
          <v-card-title class="text-lowercase">Password Reset</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="save">
              <v-text-field
                v-model="login.username"
                type="text"
                label="Username"
                :rules="required"
                class="text-lowercase"
              ></v-text-field>

              <v-text-field
                v-model="newPassword"
                type="password"
                label="New Password"
                :rules="passwordRules"
                class="text-lowercase"
              ></v-text-field>

              <v-text-field
                v-model="repeatNewPassword"
                type="password"
                label="Repeat New Password"
                :rules="repeatPasswordRules(newPassword)"
                class="text-lowercase"
              ></v-text-field>

              <template v-if="hasErrors">
                <v-alert
                  v-for="(error, i) in errors"
                  :key="i"
                  type="error"
                  class="text-lowercase"
                >
                  {{ error }}
                </v-alert>
              </template>

              <v-btn type="submit" color="primary" class="text-lowercase">
                Reset Password
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'
import { passwordRules, repeatPasswordRules } from '~/models/user/validation'
import ProgressService from '~/services/progress/service'
import { debounce } from '~/helpers/helpers'

@Component
export default class ForgotPasswordPage extends FormPageComponent {
  newPassword = ''
  repeatNewPassword = ''
  login = {
    username: ''
  }
  passwordRules = passwordRules
  repeatPasswordRules = repeatPasswordRules

  @debounce
  async save() {
    ProgressService.start()
    this.errors = []
    const result = await this.$axios
      .$post('/api/auth/forgot', {
        username: this.login.username,
        newPassword: this.newPassword
      })
      .catch((error) => {
        this.errors = error.response.data.messages
      })

    ProgressService.stop()

    if (result) {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>
