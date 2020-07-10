<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="4">
        <v-card>
          <v-card-title class="text-lowercase">Account Settings</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="save">
              <v-text-field
                v-model="login.id"
                type="text"
                label="Id"
                class="text-lowercase"
                disabled
              ></v-text-field>

              <v-text-field
                v-model="login.username"
                type="text"
                label="Username"
                class="text-lowercase"
                disabled
              ></v-text-field>

              <v-text-field
                v-model="login.password"
                type="password"
                label="Current Password"
                class="text-lowercase"
                :rules="required"
              ></v-text-field>

              <v-text-field
                v-model="newPassword"
                type="password"
                label="New Password"
                class="text-lowercase"
                :rules="passwordRules"
              ></v-text-field>

              <v-text-field
                v-model="repeatPassword"
                type="password"
                label="Repeat New Password"
                class="text-lowercase"
                :rules="repeatPasswordRules"
              ></v-text-field>

              <template v-if="hasErrors">
                <v-alert
                  v-for="(error, i) in errors"
                  :key="i"
                  type="error"
                  dense
                >
                  {{ error }}
                </v-alert>
              </template>

              <v-alert
                v-if="success"
                type="success"
                dense
                class="text-lowercase"
              >
                Account saved
              </v-alert>

              <v-btn type="submit" color="primary" class="text-lowercase">
                Save
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

import { passwordRules } from '../server/core/user/validator'
import FormPageComponent from '~/components/pages/formPage.component'

@Component({
  middleware: 'auth'
})
export default class AccountPage extends FormPageComponent {
  newPassword = ''
  repeatPassword = ''
  login = {
    id: this.$auth.user.id,
    username: this.$auth.user.username,
    password: ''
  }

  get passwordRules() {
    return passwordRules()
  }

  get repeatPasswordRules() {
    return [
      (v: string) => (v || '') === this.newPassword || 'Passwords must match'
    ]
  }

  async save() {
    this.errors = []
    this.success = await this.$axios
      .$post('/api/auth/update', {
        username: this.login.username,
        password: this.login.password,
        newPassword: this.newPassword
      })
      .catch((error) => {
        if (error.response.status === 401) {
          this.errors = ['Incorrect password']
        } else {
          this.errors = ['Error']
        }
      })
  }
}
</script>
