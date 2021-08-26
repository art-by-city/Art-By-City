<template>
  <div class="user-profile-page">
    <v-container fluid>
      <v-row align="end">
        <v-col
          cols="1" offset="3"
            sm="2" offset-sm="3"
        >
          <UserAvatar
            class="user-profile-avatar"
            :user="artist"
            :size="$vuetify.breakpoint.name"
            :editable="artist.address === $auth.user.address"
            @change="uploadAvatar"
          />
        </v-col>
        <v-col
          cols="6" offset="2"
            sm="4" offset-sm="1"
        >
          <div class="user-profile-info">
            <div class="
              user-profile-username
              font-weight-black
              text-body-2
            ">
              {{ artist.address }}
            </div>
          </div>
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
          <v-row>
            <v-col
              v-for="(post, i) in feed"
              :key="post.guid"
              cols="4"
            >
              <v-lazy transition="fade-transition">
                <ArtworkCard :artwork="post.artwork" />
              </v-lazy>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'

import { User } from '~/models'
import { FeedItem } from '~/types'
import { readFileAsDataUrlAsync } from '~/helpers'
import ProgressService from '~/services/progress/service'
import PageComponent from '~/components/pages/page.component'
import ArtworkCard from '~/components/artwork/ArtworkCard.component.vue'

@Component({
  components: {
    ArtworkCard
  }
})
export default class UserProfilePage extends PageComponent {
  feed: FeedItem[] = []
  artist: User = { address: '' }

  async fetch() {
    ProgressService.start()
    try {
      this.artist.address = this.$route.params.username
      this.feed = await this.$artworkService.fetchArtworkFeed(
        this.artist.address
      )
    } catch (error) {
      console.error(error)
      this.$toastService.error(error)
    } finally {
      ProgressService.stop()
    }
  }

  async uploadAvatar(image: File) {
    const avatar = {
      src: await readFileAsDataUrlAsync(image)
    }

    const uploadedAvatar = await this.$avatarService.uploadAvatar(avatar)

    this.artist.avatar = uploadedAvatar
  }
}
</script>

<style scoped>
.user-profile-username {
  margin-left: -3px;
  word-break: break-word;
}
.user-profile-city {
  font-weight: 400;
  font-size: 1rem;
  letter-spacing: 0.009375rem;
}
.user-profile-avatar {
  left: 50%;
  transform: translateX(-50%)
}
.user-profile-info {
  position: relative;
}
.profile-edit-controls {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
