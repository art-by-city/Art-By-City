<template>
  <div class="user-profile-page">
    <v-container fluid>
      <v-row align="end">
        <v-col
          cols="2" offset="2"
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
              {{ artist.address }}
            </v-card-title>
            <v-card-subtitle>
              <!-- TODO: address here if username -->
            </v-card-subtitle>
            <v-card-text>
              <v-btn
                v-if="likesCount > 0"
                text
                :to="`${this.artist.address}/likes`"
              >
                Liked Art: {{ likesCount }}
              </v-btn>
            </v-card-text>
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
          <ArtistFeed :address="artist.address" />
        </v-col>
      </v-row>
    </v-container>

    <AvatarUploadDialog :show.sync="showAvatarUploadDialog" />
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'

import { User } from '~/models'
import { debounce } from '~/helpers'
import ProgressService from '~/services/progress/service'
import PageComponent from '~/components/pages/page.component'
import AvatarUploadDialog from
  '~/components/avatar/AvatarUploadDialog.component.vue'
import ArtistFeed from '~/components/profile/ArtistFeed.component.vue'

@Component({
  components: {
    AvatarUploadDialog,
    ArtistFeed
  }
})
export default class UserProfilePage extends PageComponent {
  head() {
    return {
      title: `${this.$route.params.username}'s profile`
    }
  }

  artist: User = { address: this.$route.params.username }
  showAvatarUploadDialog: boolean = false
  likesCount: number = 0

  get isOwner(): boolean {
    return this.$auth.user && this.artist.address === this.$auth.user.address
  }

  async fetch() {
    ProgressService.start()
    try {
      this.likesCount = await this.$likesService.fetchTotalLikedByUser(
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
