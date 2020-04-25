<template>
  <div>
    <v-form ref="form" v-model="valid" @submit.prevent="userLogin">
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
        required
      ></v-text-field>

      <v-btn type="submit">Login</v-btn>
    </v-form>
  </div>
</template>

<script>
import { usernameRules } from '~/helpers/validation/user'

export default {
  data() {
    return {
      valid: false,
      login: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    usernameRules
  },
  watch: {
    model: 'validateForm'
  },
  methods: {
    validateForm() {
      this.$refs.form.validate()
    },
    async userLogin() {
      try {
        await this.$auth.loginWith('local', {
          data: this.login
        })
      } catch (err) {
        // TODO -> Sentry
        // eslint-disable-next-line no-console
        console.error(err)
      }
    }
  }
}
</script>
