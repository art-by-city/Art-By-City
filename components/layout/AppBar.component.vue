<template>
  <v-app-bar
    :clipped-left="true"
    fixed
    app
    dense
    flat
    dark
    class="app-bar"
  >
    <v-btn text plain to="/">
      ART &times; BY &times; CITY
    </v-btn>

    <v-spacer></v-spacer>

    <template v-if="!user">
      <v-btn text>log in</v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'

import User from '~/models/user/user'
import { ConfigStoreState } from '~/store/config'

@Component
export default class AppBar extends Vue {
  @Prop({
    type: Object,
    required: false,
    default: null
  }) readonly user!: User | null

  @Prop({
    type: Object,
    required: true
  }) readonly config!: ConfigStoreState

  @Emit('logout') onLogoutClicked() {}
}
</script>

<style scoped>
.app-bar >>> .v-toolbar__content {
/* .app-bar { */
  width: 1250px;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
}

.app-bar >>> a {
  /* color: rgba(0, 0, 0, 0.87); */
  color: white;
  text-decoration: none;
}
</style>
