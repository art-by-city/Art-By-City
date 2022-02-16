<template>
  <v-dialog
    :value="content"
    @click:outside="onCloseDialog"
    :max-width="600"
  >
    <template v-if="content === 'sign-up'">
      <v-container fluid class="pa-1">
        <v-row dense>
          <v-card tile width="100%">
            <!-- <v-card-title class="text-h2">
              <strong>Art By City</strong>
            </v-card-title> -->
            <v-card-text>
              <p>
                <strong class="text-h6">Art By City</strong> is a decentralized application and community.
                This means that an <strong>Arweave Wallet</strong> is required
                to log in.
              </p>
              <p>
                If you're unfamiliar with Arweave, Web 3.0, decentralized
                applications (dApps), or blockchain technology you can sign up
                for our <strong>Artist Pre-Registration</strong> program and
                we'll get in touch to help you get started on your Web 3.0
                journey.
              </p>
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
            <GetArweaveWallet @login="onLogin" @create="onCreate" />
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
    <template v-if="content === 'alpha-agreement'">
      <v-container fluid class="pa-1">
        <v-row dense>
          <v-card tile width="100%">
            <v-card-title class="text-h2">
              <strong>Art By City - Alpha</strong>
            </v-card-title>
            <v-card-text>
              <p>
                <strong>Art By City</strong>
                is currently in <strong>Alpha Testing</strong>.  This dapp is our
                submission to the 5th run of the
                <a
                  href="https://owf.dev"
                  target="_blank"
                  style="text-decoration-none"
                >
                  Open Web Foundry
                  <v-icon small dense style="margin-top: -4px;">
                    mdi-open-in-new
                  </v-icon>
                </a> hackathon.
              </p>
              <p>
                By using <strong>Art By City</strong> you acknowledge that you may
                experience bugs or errors, so please bear with us as we work to build
                <strong>The Artist's Permaweb</strong>.  Please feel free to help
                us test the app, and provide us with feedback!
              </p>
              <br />
              <v-btn
                color="green"
                @click="close"
                elevation="2"
                outlined
                class="mx-auto"
              >I understand</v-btn>
            </v-card-text>
          </v-card>
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

  @Emit('login') onLogin() {
    this.close()
  }

  onCreate() {
    this.close()
    this.$router.push('/create')
  }

  private close() {
    this.content = ''
  }

  private onCloseDialog() {
    if (this.content === 'alpha-agreement') {
      return
    }
    this.close()
  }

  private onSignUp() {
    this.close()
    this.$router.push('/register')
  }
}
</script>
