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

              <CitySelector
                v-model="$auth.user.city"
                :cities="cities"
                disabled
              />

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
                :rules="repeatPasswordRules(newPassword)"
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
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'
import { passwordRules, repeatPasswordRules } from '~/models/user/validation'
import CitySelector from '~/components/forms/citySelector.component.vue'

@Component({
  middleware: 'auth',
  components: {
    CitySelector
  }
})
export default class AccountPage extends FormPageComponent {
  newPassword = ''
  repeatPassword = ''
  login = {
    id: this.$auth.user.id,
    username: this.$auth.user.username,
    password: ''
  }
  passwordRules = passwordRules
  repeatPasswordRules = repeatPasswordRules
  cities: string[] = []

  async asyncData({ $axios, store }: Context) {
    const errors = []
    let cities = [] as any[]

    try {
      const config = await $axios.$get('/api/config')
      store.commit('config/setConfig', config)
      cities = config.cities
    } catch (error) {
      errors.push(error.response?.data?.messages)
    }

    return { errors, cities }
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
