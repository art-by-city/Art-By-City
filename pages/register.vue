<template>
  <div>
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

      <v-btn type="submit">Sign Up</v-btn>
    </v-form>
  </div>
</template>

<script type>
import { usernameRules, passwordRules } from '~/helpers/validation/user'

export default {
  data() {
    return {
      valid: false,
      login: {
        username: '',
        password: ''
      },
      errors: []
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
          this.errors = error.response.data.messages
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
