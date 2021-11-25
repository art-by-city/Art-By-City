<template>
  <v-dialog
    :value="content"
    @click:outside="onCloseDialog"
    :max-width="maxWidth"
  >
    <template v-if="content === 'get-wallet'">
      <GetArweaveWallet @login="login" />
    </template>
    <template v-if="content === 'sign-up'">
      <v-container fluid class="pa-1">
        <v-row dense>
          <v-card tile width="100%">
            <v-card-title class="text-h2">
              <strong>Art By City</strong>
            </v-card-title>
            <v-card-text>
              is a decentralized application and community.
              This means that an <strong>Arweave Wallet</strong> is required to
              log in.  If you're unfamiliar with Arweave, Web 3.0, decentralized
              applications (dApps), or blockchain technology you can sign up for
              our <strong>Artist Pre-Registration</strong> program and we'll get
              in touch to help you get started on your Web 3.0 journey.
            </v-card-text>
          </v-card>
        </v-row>
        <v-row dense>
          <v-col
            class="pa-0"
            dense
            cols="12"
            md="6"
          >
            <GetArweaveWallet @login="login" />
          </v-col>
          <v-col
            class="pa-0"
            dense
            cols="12"
            md="6"
            order="first"
            order-md="last"
          >
            <SignUp @signUp="onSignUp" />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, PropSync, Emit } from 'nuxt-property-decorator'

import GetArweaveWallet from './getArweaveWallet.component.vue'
import SignUp from './signUp.component.vue'

@Component({
  components: {
    GetArweaveWallet,
    SignUp
  }
})
export default class AuthDialog extends Vue {
  @PropSync('show', {
    type: String,
    required: true,
    default: ''
  }) content?: string

  @Emit('login') login() {
    this.close()
  }

  get maxWidth() {
    if (this.content === 'get-wallet') {
      return 300
    }

    return 600
  }

  private close() {
    this.content = ''
  }

  private onCloseDialog() {
    this.close()
  }

  private onSignUp() {
    this.close()
    this.$router.push('/register')
  }
}
</script>
