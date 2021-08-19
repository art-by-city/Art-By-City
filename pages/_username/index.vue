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
            abbr
            :user="artist"
            :size="$vuetify.breakpoint.name"
          />
        </v-col>
        <v-col
          cols="6" offset="2"
            sm="4" offset-sm="1"
        >
          <div class="user-profile-info">
            <div class="
              user-profile-username
              text-lowercase
              font-weight-black
              text-body-2
            ">
              {{ artist.username }}
            </div>
            <div class="
              user-profile-username
              text-lowercase
              font-weight-black
              text-body-2
            ">
              {{ artist.address }}
            </div>
          </div>
        </v-col>
        <v-btn v-if="isProfileOwner"
          fab
          icon
          small
          right
          color="primary"
          elevation="2"
          @click="onEditProfileClicked"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
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

    <ProfileEditForm
      :show.sync="showEditForm"
      :username.sync="artist.username"
    />
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'

import PageComponent from '~/components/pages/page.component'
import ArtworkCard from '~/components/artwork/ArtworkCard.component.vue'
import ProfileEditForm from '~/components/profile/profileEditForm.component.vue'
import { User } from '~/models'
import { FeedItem } from '~/types'
import ProgressService from '~/services/progress/service'
import { debounce } from '~/helpers'

@Component({
  components: {
    ArtworkCard,
    ProfileEditForm
  }
})
export default class UserProfilePage extends PageComponent {
  feed: FeedItem[] = []
  artist: User = { address: '' }
  showEditForm: boolean = false

  async fetch() {
    ProgressService.start()
    try {
      const username = await this.$usernameService.resolveUsername(
        this.$route.params.username
      )

      if (username) {
        this.artist.username = username
        this.artist.address = this.$route.params.username
      } else {
        const address = await this.$usernameService.resolveAddress(
          this.$route.params.username
        )

        if (address) {
          this.artist.address = address
          this.artist.username = this.$route.params.username
        } else {
          this.artist.address = this.$route.params.username
        }
      }

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

  get isProfileOwner(): boolean {
    if (
      this.$auth.loggedIn &&
      this.$auth.user.address === this.artist.address
    ) {
      return true
    }

    return false
  }

  @debounce
  onEditProfileClicked() {
    if (this.isProfileOwner) {
      this.showEditForm = true
    }
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
