<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="2">
        <h1 style="font-weight: normal">art x by x city</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="4">
        <v-card>
          <v-card-title class="text-lowercase">Sign Up</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="register">
              <v-text-field
                v-model="login.username"
                type="text"
                label="Username"
                :rules="usernameRules"
                required
                class="text-lowercase"
              ></v-text-field>

              <v-text-field
                v-model="login.password"
                type="password"
                label="Password"
                :rules="passwordRules"
                required
                class="text-lowercase"
              ></v-text-field>

              <v-text-field
                type="password"
                label="Repeat Password"
                :rules="repeatPasswordRules(login.password)"
                required
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
                Sign Up
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
import {
  usernameRules,
  passwordRules,
  repeatPasswordRules
} from '~/models/user/validation'

@Component
export default class RegisterPage extends FormPageComponent {
  login = {
    username: '',
    password: ''
  }
  usernameRules = usernameRules
  passwordRules = passwordRules
  repeatPasswordRules = repeatPasswordRules

  async register() {
    this.errors = []
    const registrationResult = await this.$axios
      .$put('/api/auth/register', this.login)
      .catch((error) => {
        this.errors = [error.response.data.error.message]
      })

    if (registrationResult && registrationResult.token) {
      try {
        await this.$auth.setUserToken(registrationResult.token)
        this.$router.push({ path: '/' })
      } catch (err) {
        // TODO -> Sentry
        // eslint-disable-next-line no-console
        console.error(err)
      }
    }
  }
}
</script>
