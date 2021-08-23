<template>
  <v-card tile outlined height="200">
    <v-card-title>Sign Up</v-card-title>
    <v-card-text>
      <p>Sign Up for our mailing list to get notified when
        <strong>Art By City Accounts</strong> are available
      </p>
    </v-card-text>
    <v-card-actions>
      <v-btn
        elevation="6"
        class="mx-auto"
        @click="onSignUpClicked"
      >
        <span class="mx-2">Sign Up</span>
        <v-icon dense>mdi-open-in-new</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'nuxt-property-decorator'

import { debounce } from '~/helpers'

@Component
export default class SignUp extends Vue {
  @debounce
  @Emit('signUp') onSignUpClicked() {}
}
</script>
