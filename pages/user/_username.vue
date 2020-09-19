<template>
  <v-container v-if="profile" fluid>
    <ArtworkModal :artwork.sync="modalArtwork" />
    <v-row align="end">
      <v-col cols="2" offset="3">
        <UserAvatar
          class="user-profile-avatar"
          :user="profile.user"
          :editable="$auth.user.id === profile.user.id"
          @onChange="onUserAvatarChanged"
        />
      </v-col>
      <v-col cols="4">
        <div class="user-profile-username text-lowercase">{{ profile.user.username }}</div>
        <div class="text-caption text-lowercase">{{ profile.user.city }}</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" offset="3">
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" offset="3">
        <v-row>
          <v-col
            class="artwork-grid-col"
            v-for="(artwork, i) in profile.artworks"
            :key="i"
            cols="4"
          >
            <v-lazy transition="fade-transition">
              <ArtworkCard :artwork="artwork" @click="onArtworkCardClicked(artwork)" />
            </v-lazy>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import PageComponent from '~/components/pages/page.component'
import ArtworkCard from '~/components/artwork/ArtworkCard.component.vue'
import ArtworkModal from '~/components/artwork/ArtworkModal.component.vue'
import ToastService from '~/services/toast/service'
import { debounce } from '~/helpers/helpers'

@Component({
  components: {
    ArtworkCard,
    ArtworkModal
  }
})
export default class UserProfilePage extends PageComponent {
  profile: any | null
  modalArtwork: any | null = null

  async asyncData({ $axios, params }: Context) {
    try {
      const { payload } = await $axios.$get(`/api/user/${params.username}/profile`)

      return { profile: payload }
    } catch (error) {
      ToastService.error('error fetching user profile')
    }
  }

  onArtworkCardClicked(artwork: any) {
    this.modalArtwork = artwork
  }

  @debounce
  async onUserAvatarChanged(image: File) {
    const avatar = await this.$profileService.uploadUserAvatar(image)
    if (avatar) {
      this.profile = Object.assign(
        {},
        this.profile,
        { user: { ...this.profile.user, avatar } }
      )
    }
  }
}
</script>

<style scoped>
.user-profile-username {
  font-weight: 300;
  font-size: 3.75rem;
  letter-spacing: -0.03125rem;
  margin-left: -3px;
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
</style>
