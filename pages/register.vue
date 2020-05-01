<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="4">
        <v-card>
          <v-card-title>Sign Up</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="register">
              <v-text-field
                v-model="login.username"
                type="text"
                label="Username"
                :rules="usernameRules"
                required
              ></v-text-field>

              <v-text-field
                v-model="login.password"
                type="password"
                label="Password"
                :rules="passwordRules"
                required
              ></v-text-field>

              <v-text-field
                type="password"
                label="Repeat Password"
                :rules="repeatPasswordRules"
                required
              ></v-text-field>

              <template v-if="errors.length > 0">
                <v-alert v-for="(error, i) in errors" :key="i" type="error">
                  {{ error }}
                </v-alert>
              </template>

              <v-btn type="submit" color="primary">Sign Up</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script type>
import {
  usernameRules,
  passwordRules
} from '../server/core/validators/accountValidator'

export default {
  data() {
    return {
      valid: false,
      errors: [],
      login: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    usernameRules,
    passwordRules,
    repeatPasswordRules() {
      return [
        (v) => (v || '') === this.login.password || 'Passwords must match'
      ]
    }
  },
  watch: {
    model: 'validateForm'
  },
  methods: {
    validateForm() {
      this.$refs.form.validate()
    },
    async register() {
      this.errors = []
      const result = await this.$axios
        .$put('/api/auth/register', this.login)
        .catch((error) => {
          this.errors = [error.response.data.error.message]
        })

      if (result && result.token) {
        try {
          await this.$auth.setUserToken(result.token)
          this.$router.push({ path: '/' })
        } catch (err) {
          // TODO -> Sentry
          // eslint-disable-next-line no-console
          console.error(err)
        }
      }
    }
  }
}
</script>
