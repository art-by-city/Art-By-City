<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="4">
        <v-card>
          <v-card-title>Account Settings</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="save">
              <v-text-field
                v-model="login.username"
                type="text"
                label="Username"
                :rules="required"
                disabled
              ></v-text-field>

              <v-text-field
                v-model="login.password"
                type="password"
                label="Current Password"
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
                <v-alert
                  v-for="(error, i) in errors"
                  :key="i"
                  type="error"
                  dense
                >
                  {{ error }}
                </v-alert>
              </template>

              <v-alert v-if="success" type="success" dense>
                Account saved
              </v-alert>

              <v-btn type="submit" color="primary">Save</v-btn>
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
  middleware: 'auth',
  data() {
    return {
      valid: false,
      errors: [],
      success: false,
      login: {
        username: this.$auth.user.username,
        password: ''
      },
      newPassword: '',
      repeatNewPassword: ''
    }
  },
  computed: {
    passwordRules,
    repeatPasswordRules() {
      return [(v) => (v || '') === this.newPassword || 'Passwords must match']
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
}
</script>
