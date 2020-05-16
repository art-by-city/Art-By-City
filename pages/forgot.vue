<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="4">
        <v-card>
          <v-card-title>Password Reset</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="save">
              <v-text-field
                v-model="login.username"
                type="text"
                label="Username"
                :rules="required"
              ></v-text-field>

              <v-text-field
                v-model="newPassword"
                type="password"
                label="New Password"
                :rules="passwordRules"
              ></v-text-field>

              <v-text-field
                v-model="repeatNewPassword"
                type="password"
                label="Repeat New Password"
                :rules="repeatPasswordRules"
              ></v-text-field>

              <template v-if="errors.length > 0">
                <v-alert v-for="(error, i) in errors" :key="i" type="error">
                  {{ error }}
                </v-alert>
              </template>

              <v-btn type="submit" color="primary">Reset Password</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { required } from '../server/core/validators'
import { passwordRules } from '../server/core/user/validator'

export default {
  data() {
    return {
      valid: false,
      errors: [],
      login: {
        username: ''
      },
      newPassword: '',
      repeatNewPassword: ''
    }
  },
  computed: {
    passwordRules,
    repeatPasswordRules() {
      return required().concat([
        (v) => (v || '') === this.newPassword || 'Passwords must match'
      ])
    },
    required
  },
  watch: {
    model: 'validateForm'
  },
  methods: {
    validateForm() {
      this.$refs.form.validate()
    },
    async save() {
      this.errors = []
      const result = await this.$axios
        .$post('/api/auth/forgot', {
          username: this.login.username,
          newPassword: this.newPassword
        })
        .catch((error) => {
          this.errors = error.response.data.messages
        })

      if (result) {
        this.$router.push({ path: '/login' })
      }
    }
  }
}
</script>
