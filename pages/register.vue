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
            <v-form ref="form" v-model="valid" @submit.prevent="register" autocomplete="off">
              <v-text-field
                v-model="login.username"
                type="text"
                name="username"
                label="Username"
                :rules="usernameRules"
                required
                class="text-lowercase"
                autocomplete="off"
                aria-autocomplete="off"
              ></v-text-field>

              <v-text-field
                v-model="login.email"
                type="email"
                label="Email"
                name="email"
                :rules="emailRules"
                required
                class="text-lowercase"
                autocomplete="off"
                aria-autocomplete="off"
              ></v-text-field>

              <CitySelector
                v-model="login.city"
                :cities="$store.state.config.cities"
                :disabled="disableCityInput"
              />

              <v-text-field
                v-model="login.password"
                type="password"
                label="Password"

                required
                class="text-lowercase"
                autocomplete="new-password"
              ></v-text-field>

              <v-text-field
                type="password"
                label="Repeat Password"
                :rules="repeatPasswordRules(login.password)"
                required
                class="text-lowercase"
                autocomplete="new-password"
              ></v-text-field>

              <v-text-field
                v-model="login.inviteCode"
                :rules="inviteCodeRules"
                :disabled="disableInviteCodeInput"
                type="text"
                name="inviteCode"
                label="Invite Code"
                required
                class="text-lowercase"
                autocomplete="off"
                aria-autocomplete="off"
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
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'
import {
  usernameRules,
  emailRules,
  passwordRules,
  repeatPasswordRules,
  inviteCodeRules
} from '~/models/user/validation'
import CitySelector from '~/components/forms/citySelector.component.vue'
import { debounce } from '~/helpers/helpers'

@Component({
  components: {
    CitySelector
  }
})
export default class RegisterPage extends FormPageComponent {
  login = {
    inviteCode: '',
    username: '',
    email: '',
    password: '',
    city: ''
  }
  disableCityInput = false
  disableInviteCodeInput = false
  usernameRules = usernameRules
  emailRules = emailRules
  passwordRules = passwordRules
  repeatPasswordRules = repeatPasswordRules
  inviteCodeRules = inviteCodeRules

  async asyncData({ store, query }: Context) {
    // Temporarily restrict city to NYC, if found
    const cities = store?.state?.config?.cities || []
    let forceRegistrationCityId
    for (let i = 0; i < cities.length; i++) {
      if (cities[i].code === 'NYC') {
        forceRegistrationCityId = cities[i].id
      }
    }

    return {
      disableCityInput: !!forceRegistrationCityId,
      disableInviteCodeInput: !!query.invite,
      login: {
        inviteCode: query.invite || '',
        username: '',
        email: '',
        password: '',
        city: forceRegistrationCityId || ''
      }
    }
  }

  @debounce
  async register() {
    this.errors = []
    const registrationResult = await this.$axios
      .$put('/api/auth/register', this.login)
      .catch((error) => {
        this.errors = [error.response.data.error.message]
      })

    if (registrationResult && registrationResult.token) {
      try {
        await this.$auth.setUserToken(
          registrationResult.token,
          registrationResult.refresh_token
        )
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
