<template>
  <v-card tile outlined height="250">
    <v-card-title>Sign Up</v-card-title>
    <v-card-text>
      <p>Sign Up for our mailing list to get notified when
        <strong>Art By City Accounts</strong> are available
      </p>
    </v-card-text>
    <v-container fluid>
      <v-row justify="center">
        <v-btn
          elevation="2"
          outlined
          class="mx-auto"
          @click="onSignUpClicked"
        >
          <span class="mx-2">Sign Up</span>
        </v-btn>
      </v-row>
    </v-container>
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
