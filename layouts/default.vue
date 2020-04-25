<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :clipped="true" fixed app>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
          :disabled="item.disabled"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="true" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer />
      <v-toolbar-title>art x by x city</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <template v-if="!$auth.loggedIn">
          <v-btn text to="/register">SIGN UP</v-btn>
          <v-divider vertical />
          <v-btn text to="/login">LOG IN</v-btn>
        </template>
        <template v-if="$auth.loggedIn">
          <v-btn text>{{ $auth.user.username }}</v-btn>
          <v-divider vertical />
          <v-btn text @click="logout">LOG OUT</v-btn>
        </template>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Home',
          to: '/'
        },
        {
          icon: 'mdi-cart',
          title: 'Shop (Coming Soon!)',
          to: '/',
          disabled: true
        }
      ]
    }
  },
  methods: {
    async logout() {
      await this.$auth.logout()
    }
  }
}
</script>
