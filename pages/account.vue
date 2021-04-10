<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="4">
        <v-expansion-panels accordion>
          <v-expansion-panel>
            <v-expansion-panel-header>Ethereum</v-expansion-panel-header>
            <v-expansion-panel-content>
              ethereum wallet stuff here
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel-header>Arweave</v-expansion-panel-header>
            <v-expansion-panel-content>
              arweave wallet stuff here
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>Account</v-expansion-panel-header>
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

  get userCity() {
    return this.user?.city || ''
  }

  get user(): User | null {
    return getUser(this.$auth.user)
  }

  async asyncData({ $axios, $auth, app, redirect }: Context) {
    let user = {} as any
    try {
      const _user = getUser($auth.user)
      if (_user) {
        const { payload } = await $axios.$get(`/api/user/${_user.id}/account`)
        user = payload
      } else {
        redirect('/login')
      }
    } catch (error) {
      app.$toastService.error('error fetching account')
    }

    return { login: user }
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
