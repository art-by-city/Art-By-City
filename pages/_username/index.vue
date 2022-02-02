<template>
  <div class="user-profile-page">
    <v-container fluid>
      <v-row align="end">
        <v-col
          cols="2" offset="2"
            sm="2" offset-sm="3"
        >
          <UserAvatar :user="artist" />
        </v-col>
        <v-col
          cols="6" offset="2"
            sm="4" offset-sm="1"
        >
          <v-card elevation="0">
            <v-card-title>
              {{ primaryName }}
            </v-card-title>
            <v-card-subtitle>
              {{ secondaryName }}
            </v-card-subtitle>
            <v-card-text>
              <div v-if="artist.profile">{{ artist.profile.bio }}</div>
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
                <template v-if="isOwner">
                  <v-speed-dial v-model="showEditSpeedDial" direction="bottom">
                    <template v-slot:activator>
                      <v-btn
                        v-model="showEditSpeedDial"
                        text
                        outlined
                      >
                        Edit
                      </v-btn>
                    </template>

                    <v-btn
                      text
                      outlined
                      @click="onEditAvatarClicked"
                    >
                      Avatar
                    </v-btn>

                    <v-btn
                      text
                      outlined
                      @click="onEditProfileClicked"
                    >
                      Profile
                    </v-btn>

                  </v-speed-dial>
                </template>
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

    <!-- <template v-if="isOwner"> -->
      <AvatarUploadDialog :show.sync="showAvatarUploadDialog" />
      <EditProfileDialog :show.sync="showEditProfileDialog" />
    <!-- </template> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { User } from '~/models'
import { debounce } from '~/helpers'
import ProgressService from '~/services/progress/service'
import PageComponent from '~/components/pages/page.component'
import AvatarUploadDialog from
  '~/components/avatar/AvatarUploadDialog.component.vue'
import EditProfileDialog from
  '~/components/profile/EditProfileDialog.component.vue'
import ArtistFeed from '~/components/profile/ArtistFeed.component.vue'
import { SET_TRANSACTION_STATUS } from '~/store/transactions/mutations'
import { SetUserTransactionStatusPayload } from '~/types'

@Component({
  components: {
    AvatarUploadDialog,
    ArtistFeed,
    EditProfileDialog
  }
})
export default class UserProfilePage extends PageComponent {
  head() {
    const head: any = { meta: [] }
    const username = this.$route.params.username
    const title = username
    const avatarUrl = `${this.$config.baseUrl}/api/avatar/${username}`

    head.title = title
    head.meta.push(
      { property: 'og:title', content: title },
      { property: 'og:type', content: 'profile' },
      { property: 'profile:username', content: username },
      {
        property: 'og:url',
        content: `${this.$config.baseUrl}/${username}`
      }
    )

    head.meta.push({ property: 'og:image', content: avatarUrl })
    // head.meta.push({ property: 'og:image:type', content: '' })
    // head.meta.push({ property: 'og:image:width', content: '' })
    // head.meta.push({ property: 'og:image:height', content: '' })
    head.meta.push({
      property: 'og:image:alt',
      content: `${username}'s avatar`
    })

    if (this.artist.profile) {
      if (this.artist.profile.bio) {
        head.meta.push({
          property: 'og:description',
          content: this.artist.profile.bio
        })
      }
    }

    return head
  }

  artist: User = { address: this.$route.params.username }
  showEditSpeedDial: boolean = false
  showAvatarUploadDialog: boolean = false
  showEditProfileDialog: Boolean = false
  likesCount: number = 0

  get isOwner(): boolean {
    return this.$auth.user && this.artist.address === this.$auth.user.address
  }

  get primaryName(): string {
    return this.artist.profile?.displayName || this.artist.address
  }

  get secondaryName(): string {
    if (this.artist.profile?.displayName) {
      return this.artist.address
    }

    return ''
  }

  created() {
    if (this.$auth.loggedIn) {
      this.$store.subscribe(async (mutation, _state) => {
        if (mutation.type === `transactions/${SET_TRANSACTION_STATUS}`) {
          const payload = mutation.payload as SetUserTransactionStatusPayload
          if (payload.status === 'CONFIRMED' && payload.type === 'profile') {
            this.$fetch()
          }
        }
      })
    }
  }

  async fetch() {
    ProgressService.start()
    try {
      const profile = await this.$profileService.fetchProfile(
        this.artist.address
      )

      if (profile) {
        Vue.set(this.artist, 'profile', profile)
      }

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
    this.showEditProfileDialog = true
  }

  @debounce
  onEditAvatarClicked() {
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
.user-profile-info {
  position: relative;
}
.profile-edit-controls {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
