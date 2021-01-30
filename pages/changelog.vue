<template>
  <v-container fluid style="width: 100%;">
    <v-row justify="center">
      <v-col cols="auto">
        <h1 class="text-lowercase">What's New</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto">
        <v-timeline dense class="changelog-timeline">
          <template
            v-for="(entry, i) in changelog.entries"
          >
            <v-timeline-item
              large
              fill-dot
              color="success"
              class="changelog-timeline-item"
              icon="mdi-flag-checkered"
            >
              <a
                class="text-decoration-none"
                :href="`#${entry.version}`"
              >
                <h2 class="pt-2 black--text">
                  {{ entry.version }}
                </h2>
              </a>
            </v-timeline-item>
            <v-timeline-item
              v-for="(change, j) in entry.changes"
              :key="j"
              fill-dot
              small
              :color="change.type === 'feature' ? 'info' : 'error'"
              :icon="change.type === 'feature' ? 'mdi-gift-outline' : 'mdi-bug-outline'"
            >
              <span class="pt-2 body-2 text-lowercase" style="max-width:400px">
                {{ change.content }}
              </span>
            </v-timeline-item>
          </template>
        </v-timeline>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'
import PageComponent from '../components/pages/page.component'
import { Changelog } from '~/models/changelog'
import User, { getUser } from '../models/user/user'

const emptyChangelog = { entries: [] }

@Component
export default class ChangelogPage extends PageComponent {
  changelog: Changelog = emptyChangelog

  async asyncData({ app, $axios }: Context) {
    let changelog: Changelog = emptyChangelog
    try {
      changelog = await $axios.$get('/api/changelog')
    } catch (error) {
      app.$toastService.error('error fetching changelog')
    }

    return { changelog }
  }

  mounted() {
    this.markLastVersionSeen()
  }

  get user(): User | null {
    return getUser(this.$auth.user)
  }

  async markLastVersionSeen() {
    if (
      this.user
      && this.user.changelogLastVersionViewed
        !== this.$store.state.config.changelogLatestVersion
    ) {
      const { changelogLastVersionViewed, ...user } = this.user
      this.$auth.setUser({
        ...user,
        changelogLastVersionViewed: this.$store.state.config.changelogLatestVersion
      })
      this.$axios.$post('/api/changelog/mark', {
        version: this.$store.state.config.changelogLatestVersion
      })
    }
  }
}
</script>

<style scoped>
.changelog-timeline {
  max-width: 720px;
}
</style>
