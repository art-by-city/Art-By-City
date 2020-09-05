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
                v-model="login.email"
                type="text"
                label="Email"
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
                autocomplete="new-password"
              ></v-text-field>

              <v-text-field
                v-model="newPassword"
                type="password"
                label="New Password"
                class="text-lowercase"
                :rules="passwordRules"
                autocomplete="new-password"
              ></v-text-field>

              <v-text-field
                v-model="repeatPassword"
                type="password"
                label="Repeat New Password"
                class="text-lowercase"
                :rules="repeatPasswordRules(newPassword)"
                autocomplete="new-password"
              ></v-text-field>

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
import ToastService from '~/services/toast/service'
import ProgressService from '~/services/progress/service'

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
    email: this.$auth.user.email,
    password: ''
  }
  passwordRules = passwordRules
  repeatPasswordRules = repeatPasswordRules
  cities: string[] = []

  async asyncData({ $axios, store, $auth }: Context) {
    let cities = [] as any[]
    let user = {} as any
    try {
      const { payload } = await $axios.$get(`/api/user/${$auth.user.id}/account`)
      user = payload

      const config = await $axios.$get('/api/config')
      store.commit('config/setConfig', config)
      cities = config.cities
    } catch (error) {
      ToastService.error('error fetching account')
    }

    return { cities, login: user }
  }

  async save() {
    ProgressService.start()

    try {
      const success = await this.$axios.$post('/api/auth/update', {
        username: this.login.username,
        password: this.login.password,
        newPassword: this.newPassword
      })

      if (success) {
        ToastService.success('account saved')
      }
    } catch (error) {
      if (error.response.status === 401) {
        ToastService.error('invalid credentials')
      } else {
        ToastService.error('an error has occurred')
      }
    }

    ProgressService.stop()
  }
}
</script>
