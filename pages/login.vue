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
          <v-card-title class="text-lowercase">Log In</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="userLogin">
              <v-text-field
                v-model="login.username"
                type="text"
                label="Username"
                class="text-lowercase"
                :rules="required"
                autocomplete="off"
              ></v-text-field>

              <v-text-field
                v-model="login.password"
                type="password"
                label="Password"
                class="text-lowercase"
                :rules="required"
                autocomplete="off"
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
                Login
              </v-btn>
              <!-- <nuxt-link to="/forgot">I forgot my password</nuxt-link>-->
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

@Component
export default class LoginPage extends FormPageComponent {
  login = {
    username: '',
    password: ''
  }

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
