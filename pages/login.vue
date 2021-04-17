<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" style="text-align: center;">
        <SplashLogo />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="userLogin">
              <v-text-field
                v-model="login.username"
                type="text"
                label="Username or Email"
                class="text-lowercase"
                :rules="required"
                autocomplete="new-password"
              ></v-text-field>

              <v-text-field
                v-model="login.password"
                type="password"
                label="Password"
                class="text-lowercase"
                :rules="required"
                autocomplete="new-password"
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

              <v-btn text type="submit" class="text-lowercase">
                Login
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

import FormPageComponent from '../components/pages/formPage.component'
import { debounce } from '~/helpers/helpers'

@Component
export default class LoginPage extends FormPageComponent {
  login = {
    username: '',
    password: ''
  }

  @debounce
  async userLogin() {
    this.errors = []

    await this.$auth
      .loginWith('local', {
        data: this.login
      })
      .catch((error) => {
        if (error.response.status === 401) {
          this.errors = ['Invalid credentials']
        } else {
          this.errors = ['Error']
        }
      })
  }
}
</script>
