<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
        <span class="text-h2">Art By City Mailing List</span>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto" sm="6">
        <p class="text-body-1">
          Sign up for the Art By City Mailing List or join the Art By City
          Discord Server to get notified about updates, including when we
          launch Art By City accounts!
        </p>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto">
        <a
          class="link-with-logo"
          href="https://forms.gle/stQBR3HpS6oEJz4k6"
          target="_blank"
        >
          <v-img
            contain
            max-height="72px"
            src="/Forms_2020.svg"
          ></v-img>
          <span class="link-title">
            Google Form Sign Up
            <v-icon small dense class="adjust-icon">
              mdi-open-in-new
            </v-icon>
          </span>
        </a>
      </v-col>
      <v-col cols="auto">
        <a
          class="link-with-logo"
          href="https://discord.gg/SsHHQGSKTB"
          target="_blank"
        >
          <v-img
            contain
            max-height="72px"
            src="/Discord-Logo-Black.svg"
          ></v-img>
          <span class="link-title">
            Art By City Discord
            <v-icon small dense class="adjust-icon">
              mdi-open-in-new
            </v-icon>
          </span>
        </a>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class RegisterPage extends Vue {}
</script>

<style scoped>
.adjust-icon {
  margin-top: -3px;
}
.link-with-logo {
  text-align: center;
  display: inline-block;
}
</style>
