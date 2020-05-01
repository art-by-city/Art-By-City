<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="4">
        <v-card>
          <v-card-title>Log In</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="userLogin">
              <v-text-field
                v-model="login.username"
                type="text"
                label="Username"
                :rules="required"
              ></v-text-field>

              <v-text-field
                v-model="login.password"
                type="password"
                label="Password"
                :rules="required"
              ></v-text-field>

              <template v-if="errors.length > 0">
                <v-alert v-for="(error, i) in errors" :key="i" type="error">
                  {{ error }}
                </v-alert>
              </template>

              <v-btn type="submit" color="primary">Login</v-btn>
              <!-- <nuxt-link to="/forgot">I forgot my password</nuxt-link>-->
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { required } from '../server/core/validators'

export default {
  data() {
    return {
      errors: [],
      valid: false,
      login: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    required
  },
  watch: {
    model: 'validateForm'
  },
  methods: {
    validateForm() {
      this.$refs.form.validate()
    },
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
}
</script>
