<template>
  <div class="user-profile-page">
    <v-container fluid v-if="artist">
      <v-row dense>
        <v-col
          cols="2" offset="2"
            sm="2" offset-sm="3"
        >
          <v-row class="mt-4" justify="center">
            <UserAvatar :user="artist" />
          </v-row>
          <v-row class="mt-4 mb-1 mx-auto" justify="center">
            <template v-if="isOwner">
              <v-speed-dial v-model="showEditSpeedDial" direction="bottom">
                <template v-slot:activator>
                  <v-btn
                    v-model="showEditSpeedDial"
                    text
                    outlined
                    x-small
                  >
                    Edit
                  </v-btn>
                </template>

                <v-btn small @click="onEditAvatarClicked">Avatar</v-btn>

                <v-btn small @click="onEditProfileClicked">Profile</v-btn>

                <v-btn
                  small
                  @click="onEditUsernameClicked"
                >
                  Username
                </v-btn>

              </v-speed-dial>
            </template>
            <template v-if="!isOwner && $auth.loggedIn">
              <!-- <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-on="on"
                    v-bind="attrs"
                    class="cursor--not-allowed"
                  >
                    <v-btn
                      text
                      outlined
                      x-small
                      disabled
                    >
                      Follow
                    </v-btn>
                  </span>
                </template>
                Coming soon!
              </v-tooltip> -->
              <span>
              <v-btn
                text
                outlined
                x-small
                @click="onTipClicked"
              >
                Tip
              </v-btn>
              </span>
            </template>
          </v-row>
        </v-col>
        <v-col
          cols="6" offset="2"
            sm="4" offset-sm="0"
        >
          <v-card elevation="0">
            <v-card-title>
              {{ primaryName }}
            </v-card-title>
            <v-card-subtitle class="pb-0">
              <p class="mb-0">{{ secondaryName }}</p>
              <p class="mb-0" v-if="tertiaryName">
                <img
                  width="16px"
                  height="16px"
                  src="logo/arweave/arweave_logo.svg"
                  class="d-inline-block"
                  style="vertical-align: middle;"
                />
                <span>{{ tertiaryName }}</span>
              </p>
              <p class="mb-0" v-if="artist.profile && artist.profile.twitter">
                <v-icon small>mdi-twitter</v-icon>
                <a
                  class="text-decoration-none"
                  :href="`https://twitter.com/${artist.profile.twitter}`"
                  target="_blank"
                >
                  @{{ artist.profile.twitter }}
                </a>
              </p>
            </v-card-subtitle>
            <v-card-text class="pb-0">
              <ExpandParagraph v-if="artist.profile" dense>
                {{ artist.profile.bio }}
              </ExpandParagraph>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="10" offset="1" sm="6" offset-sm="3">
          <v-tabs v-model="tab" color="black">
            <v-tab nuxt :to="$route.path">
              Art
            </v-tab>
            <v-tab nuxt to="#liked">Liked ({{ likesCount }})</v-tab>
            <v-tab nuxt to="#tips">Tips</v-tab>
          </v-tabs>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col
          cols="12"
            sm="6"  offset-sm="3"
        >
          <template v-if="tab === 'liked'">
            <LikesFeed :address="artist.address" />
          </template>
          <template v-else-if="tab === 'tips'">
            <TipsFeed :address="artist.address" />
          </template>
          <template v-else>
            <ArtistFeed
              :address="artist.address"
              @fetched="onArtistFeedFetched"
            />
          </template>
        </v-col>
      </v-row>
    </v-container>

    <template v-if="isOwner">
      <AvatarUploadDialog :show.sync="showAvatarUploadDialog" />
      <EditProfileDialog :show.sync="showEditProfileDialog" />
      <UsernameDialog :show.sync="showUsernameDialog" />

      <v-snackbar
        v-model="showRecentPublicationMessage"
        timeout="-1"
      >
        Your Artwork was accepted by the Arweave Network but won't be available
        until it is indexed and cached by our Gateway (~5-30 minutes).
        <template v-slot:action="{ attrs }">
          <v-btn
            color="red"
            text
            v-bind="attrs"
            @click="showRecentPublicationMessage = false"
          >
            OK
          </v-btn>
        </template>
      </v-snackbar>
    </template>
    <template v-if="!isOwner && $auth.loggedIn && artist">
      <TipArtistDialog
        :show.sync="showTipArtistDialog"
        :recipientAddress="artist.address"
        :recipientDisplayName="primaryName"
      />
    </template>
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
import UsernameDialog from
  '~/components/username/UsernameDialog.component.vue'
import TipArtistDialog from
  '~/components/tips/TipArtistDialog.component.vue'
import ArtistFeed from '~/components/profile/ArtistFeed.component.vue'
import LikesFeed from '~/components/profile/LikesFeed.component.vue'
import TipsFeed from '~/components/tips/TipsFeed.component.vue'
import ExpandParagraph from '~/components/common/ExpandParagraph.component.vue'
import { DomainEntity, DomainEntityCategory } from '~/types'

@Component({
  components: {
    AvatarUploadDialog,
    ArtistFeed,
    EditProfileDialog,
    ExpandParagraph,
    LikesFeed,
    UsernameDialog,
    TipArtistDialog,
    TipsFeed
  }
})
export default class UserProfilePage extends PageComponent {
  head() {
    if (!this.artist) { return {} }

    const title = `${this.primaryName}'s Profile`
    const description = this.artist?.profile?.bio || title
    const url =
      `${this.$config.baseUrl}/${this.artist.username || this.artist.address}`

    let avatarUrl = ''
    if (this.artist.avatar) {
      avatarUrl = this.artist.avatar?.version === 1
        ? `${this.$config.baseUrl}/api/avatar/${this.artist.address}`
        : this.artist.avatar.src
    }

    const avatarAlt = `${this.primaryName}'s avatar`
    const twitter = this.artist?.profile?.twitter || ''

    return {
      title,
      meta: [
        // Open Graph
        { property: 'og:title',            content: title       },
        { property: 'og:description',      content: description },
        { property: 'og:type',             content: 'profile'   },
        {
          property: 'og:profile:username',
          content: this.artist.username || this.artist.address  },
        { property: 'og:url',              content: url         },
        { property: 'og:image',            content: avatarUrl   },
        { property: 'og:image:alt',        content: avatarAlt   },
        // { property: 'og:image:type',       content: ''          },
        // { property: 'og:image:width',      content: ''          },
        // { property: 'og:image:height',     content: ''          },

        // Twitter
        { name: 'twitter:card',    content: 'summary'     },
        { name: 'twitter:creator', content: `@${twitter}` },
      ]
    }
  }

  artist: User | null = null
  showEditSpeedDial: boolean = false
  showAvatarUploadDialog: boolean = false
  showEditProfileDialog: boolean = false
  showUsernameDialog: boolean = false
  showTipArtistDialog: boolean = false
  likesCount: number = 0
  tab: null | string = null

  get isOwner(): boolean {
    return this.$auth.user
      && (this.artist?.address || '') === this.$auth.user.address
  }

  get primaryName(): string {
    if (this.artist?.profile?.displayName) {
      return this.artist?.profile?.displayName
    }

    if (this.artist?.username) {
      return `@${this.artist.username}`
    }

    return this.artist?.address || ''
  }

  get secondaryName(): string {
    if (this.artist?.profile?.displayName) {
      if (this.artist?.username) {
        return `@${this.artist?.username}`
      }
    }

    return ''
  }

  get tertiaryName(): string {
    if (this.artist?.profile?.displayName || this.artist?.username) {
      return this.artist?.address || ''
    }

    return ''
  }

  showRecentPublicationMessage = this.$route.query['publishSuccess'] === 'true'

  created() {
    this.$nuxt.$on('profile-CONFIRMED', () => {
      if (this.isOwner) {
        this.fetchAndSet('profile')
      }
    })

    this.$nuxt.$on('username-CONFIRMED', () => {
      if (this.isOwner) {
        this.fetchAndSet('username')
      }
    })
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
        await this.fetchAndSet('profile')
        await this.fetchAndSet('avatar')

        if (this.artist?.address) {
          this.likesCount = await this.$likesService.fetchTotalLikedByUser(
            this.artist.address
          )
        }
      }
    } catch (error) {
      console.error(error)
      this.$toastService.error(error)
    } finally {
      ProgressService.stop()
    }
  }

  private async fetchAndSet(category: DomainEntityCategory) {
    let entity: DomainEntity | null = null

    if (this.artist?.address) {
      switch (category) {
        case 'profile':
          entity = await this.$profileService.fetchProfile(this.artist.address)
          break
        case 'username':
          entity = await this.$usernameService.resolveUsername(
            this.artist.address
          )
          if (entity) {
            this.$router.replace(`/${entity}`)
          }
          break
        case 'avatar':
          entity = await this.$avatarService.fetchAvatar(this.artist.address)
          break
      }
    }

    if (entity && this.artist) {
      Vue.set(this.artist, category, entity)
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

  @debounce
  onEditUsernameClicked() {
    this.showUsernameDialog = true
  }

  @debounce
  onTipClicked() {
    this.showTipArtistDialog = true
  }

  alreadySwitchedToLikes = false
  onArtistFeedFetched(count: number) {
    if (count < 1 && !this.alreadySwitchedToLikes) {
      this.alreadySwitchedToLikes = true
      this.$router.replace('#liked')
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
.user-profile-info {
  position: relative;
}
.profile-edit-controls {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
