<template>
  <v-container fluid>
    <v-row justify="center">
      <h2>Settings</h2>
    </v-row>
    <v-row justify="center">
      <v-col cols="11" sm="6">
        <v-expansion-panels multiple :value="[0]">
          <v-expansion-panel>
            <v-expansion-panel-header>
              Account
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-form ref="form" v-model="valid" @submit.prevent="save">
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
                  v-model="userCity"
                  :cities="$store.state.config.cities"
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
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
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
import ProgressService from '~/services/progress/service'
import { debounce } from '~/helpers/helpers'
import User, { getUser } from '../models/user/user'

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
    id: this.user?.id || '',
    username: this.user?.username || '',
    email: this.user?.email || '',
    password: ''
  }
  passwordRules = passwordRules
  repeatPasswordRules = repeatPasswordRules
  arweaveAddress = ''

  get userCity() {
    return this.user?.city || ''
  }

  get user(): User | null {
    return getUser(this.$auth.user)
  }

  async asyncData({ $axios, app }: Context) {
    let login = {} as any
    try {
      const { payload } = await $axios.$get(`/api/user/account`)
      login = payload
    } catch (error) {
      app.$toastService.error('error fetching account')
    }

    return { login }
  }

  @debounce
  async save() {
    ProgressService.start()

    try {
      const success = await this.$axios.$post('/api/auth/update', {
        username: this.login.username,
        password: this.login.password,
        newPassword: this.newPassword
      })

      if (success) {
        this.$toastService.success('account saved')
      }
    } catch (error) {
      if (error.response.status === 401) {
        this.$toastService.error('invalid credentials')
      } else {
        this.$toastService.error('an error has occurred')
      }
    }

    ProgressService.stop()
  }
}
</script>
