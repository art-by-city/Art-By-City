<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :clipped="true" fixed app>
      <v-list>
        <v-list-item
          v-for="(navItem, i) in navItems"
          :key="i"
          :to="navItem.to"
          router
          exact
          :disabled="navItem.disabled"
        >
          <v-list-item-action>
            <v-icon>{{ navItem.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="navItem.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="true" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer />
      <v-toolbar-title>
        <nuxt-link to="/">art x by x city</nuxt-link>
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <template v-if="!$auth.loggedIn">
          <v-btn text to="/register">Sign Up</v-btn>
          <v-divider vertical />
          <v-btn text to="/login">Log In</v-btn>
        </template>
        <template v-if="$auth.loggedIn">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on">
                <v-avatar color="indigo">
                  <span class="white--text">
                    {{ $auth.user.displayName[0] }}
                  </span>
                </v-avatar>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item to="/account">
                <v-list-item-action>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Account</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="isAdmin" to="/admin">
                <v-list-item-action>
                  <v-icon>mdi-account-cowboy-hat</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Admin</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="logout">
                <v-list-item-action>
                  <v-icon>mdi-logout-variant</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Log Out</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
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
      navItems: [
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
  computed: {
    isAdmin() {
      if (this.$auth.user && this.$auth.user.roles) {
        return this.$auth.user.roles.includes('admin')
      }

      return false
    }
  },
  methods: {
    async logout() {
      await this.$auth.logout()
    }
  }
}
</script>

<style scoped>
div.v-toolbar__content div.v-toolbar__title a {
  color: rgba(0, 0, 0, 0.87);
  text-decoration: none;
}
</style>
