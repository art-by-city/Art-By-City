<template>
  <v-dialog
    :value="content"
    @click:outside="onCloseDialog"
    :max-width="maxWidth"
  >
    <template v-if="content === 'get-wallet'">
      <GetArConnect @login="login" />
    </template>
    <template v-if="content === 'sign-up'">
      <v-container dense class="pa-1">
        <v-row dense>
          <v-col class="pa-0" dense cols="6">
            <GetArConnect @login="login" />
          </v-col>
          <v-col class="pa-0" dense cols="6">
            <SignUp @signUp="onSignUp" />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, PropSync, Emit } from 'nuxt-property-decorator'

import GetArConnect from './getArConnect.component.vue'
import SignUp from './signUp.component.vue'

@Component({
  components: {
    GetArConnect,
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
