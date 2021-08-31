<template>
  <div class="user-profile-page">
    <v-container fluid>
      <v-row align="end">
        <v-col
          cols="1" offset="3"
            sm="2" offset-sm="3"
        >
          <UserAvatar class="user-profile-avatar" :user="artist" />
        </v-col>
        <v-col
          cols="6" offset="2"
            sm="4" offset-sm="1"
        >
          <v-card elevation="0">
            <v-card-title>
              <!-- TODO: Username -->
            </v-card-title>
            <v-card-subtitle>
              {{ artist.address }}
            </v-card-subtitle>
            <v-card-actions>
              <v-spacer></v-spacer>
                <v-btn
                  v-if="isOwner"
                  text
                  outlined
                  @click="onEditProfileClicked"
                >
                  Edit
                </v-btn>
                <template v-else>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <span
                        v-on="on"
                        v-bind="attrs"
                        class="cursor--not-allowed"
                      >
                        <v-btn
                          text
                          outlined
                          disabled
                        >
                          Follow
                        </v-btn>
                      </span>
                    </template>
                    Coming soon!
                  </v-tooltip>
                </template>
            </v-card-actions>
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

    <AvatarUploadDialog
      :show.sync="showAvatarUploadDialog"
      @upload="onAvatarUploaded"
    />
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'

import { User } from '~/models'
import { FeedItem, Avatar } from '~/types'
import { debounce } from '~/helpers'
import ProgressService from '~/services/progress/service'
import PageComponent from '~/components/pages/page.component'
import ArtworkCard from '~/components/artwork/ArtworkCard.component.vue'
import AvatarUploadDialog from '~/components/avatar/AvatarUploadDialog.component.vue'

@Component({
  components: {
    ArtworkCard,
    AvatarUploadDialog
  }
})
export default class UserProfilePage extends PageComponent {
  feed: FeedItem[] = []
  artist: User = { address: this.$route.params.username }
  showAvatarUploadDialog: boolean = false

  get isOwner(): boolean {
    return this.$auth.user && this.artist.address === this.$auth.user.address
  }

  async fetch() {
    ProgressService.start()
    try {
      const avatar = await this.$avatarService.fetchAvatar(
        this.artist.address
      )

      if (avatar) {
        this.setAvatar(avatar)
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

  @debounce
  onEditProfileClicked() {
    this.showAvatarUploadDialog = true
  }

  onAvatarUploaded(txId: string) {
    // TODO -> Send to tx store with callback with code below?

    // this.setAvatar(avatar)
    // this.$auth.setUser(Object.assign({}, this.$auth.user, { avatar }))
  }

  setAvatar(avatar: Avatar) {
    this.artist = Object.assign({}, this.artist, { avatar })
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
