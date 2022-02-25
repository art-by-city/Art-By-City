<template>
  <div class="user-profile-likes">
    <v-container fluid v-if="artist">
      <v-row align="end">
        <v-col
          cols="1" offset="3"
            sm="2" offset-sm="3"
        >
          <UserAvatar class="user-profile-avatar" :user="artist" />
        </v-col>
        <v-col
          cols="6" offset="2"
            sm="5" offset-sm="0"
        >
          <v-card elevation="0">
            <v-card-title>
              Liked by {{ primaryName }}
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="10" offset="1" sm="6" offset-sm="3">
          <v-divider></v-divider>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
            sm="6"  offset-sm="3"
        >
          <LikesFeed :address="artist.address" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { User } from '~/models'
import ProgressService from '~/services/progress/service'
import LikesFeed from '~/components/profile/LikesFeed.component.vue'

@Component({
  components: {
    LikesFeed
  }
})
export default class ProfileLikesPage extends Vue {
  head() {
    return {
      title: `${this.primaryName}'s Likes`
    }
  }

  artist: User | null = null
  username: string | null = null

  get primaryName(): string {
    if (this.artist?.profile?.displayName) {
      return this.artist?.profile?.displayName
    }

    if (this.artist?.username) {
      return `@${this.artist.username}`
    }

    return this.artist?.address || ''
  }

  async fetch() {
    ProgressService.start()
    try {
      const { username, address } = await this.$usernameService.resolve(
        this.$route.params.username
      )

      if (!address) {
        this.$router.replace('/')
      } else {
        this.artist = { username, address }
        const profile = await this.$profileService.fetchProfile(address)

        if (profile) {
          Vue.set(this.artist, 'profile', profile)
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      ProgressService.stop()
    }
  }
}
</script>
