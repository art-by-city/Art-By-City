<template>
  <div class="user-profile-page">
    <v-container v-if="profile" fluid>
      <v-row align="end">
        <v-col
          cols="1" offset="3"
            sm="2" offset-sm="3"
        >
          <UserAvatar
            class="user-profile-avatar"
            :user="profile.user"
            :editable="$auth.user.id === profile.user.id"
            :size="$vuetify.breakpoint.name"
            @onChange="onUserAvatarChanged"
          />
        </v-col>
        <v-col
          cols="6" offset="2"
            sm="4" offset-sm="1"
        >
          <v-hover>
            <template v-slot:default="props">
              <div class="user-profile-info">
                <div class="
                  user-profile-username
                  text-lowercase
                  font-weight-black
                  text-body-1
                  text-sm-h2
                ">
                  {{ profile.user.username }}
                </div>
                <div class="text-caption text-lowercase">
                  <span v-if="!editMode">{{ profile.user.name }}</span>
                  <v-text-field
                    v-if="editMode"
                    v-model="profile.user.name"
                    type="text"
                    name="name"
                    label="Name"
                    class="text-lowercase"
                    autocomplete="off"
                    aria-autocomplete="off"
                  ></v-text-field>
                </div>
                <div class="text-caption text-lowercase">
                  {{ profile.user.city }}
                </div>
                <div class="profile-edit-controls">
                  <v-btn
                    v-if="editMode || (props.hover && $auth.user.id === profile.user.id)"
                    icon
                    @click="toggleEditMode"
                  >
                    <v-icon>
                      {{
                        editMode
                          ? 'mdi-content-save'
                          : 'mdi-square-edit-outline'
                      }}
                    </v-icon>
                  </v-btn>
                  <v-btn
                    v-if="editMode"
                    icon
                    @click="toggleEditMode(false)"
                  >
                    <v-icon>mdi-cancel</v-icon>
                  </v-btn>
                </div>
              </div>
            </template>
          </v-hover>
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
              v-for="(artwork, i) in profile.artworks"
              :key="i"
              cols="4"
            >
              <v-lazy transition="fade-transition">
                <ArtworkCard
                  :artwork="artwork"
                  @click="onArtworkCardClicked(artwork)"
                />
              </v-lazy>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import PageComponent from '~/components/pages/page.component'
import ArtworkCard from '~/components/artwork/ArtworkCard.component.vue'
import { debounce } from '~/helpers'

@Component({
  components: {
    ArtworkCard
  }
})
export default class UserProfilePage extends PageComponent {
  profile: any | null
  modalArtwork: any | null = null
  editMode = false

  async asyncData({ $axios, params, app, error }: Context) {
    let profile
    try {
      // const { payload } = await $axios.$get(`/api/user/${params.username}/profile`)

      // profile = payload
    } catch (err) {
      if (err.response?.status === 404) {
        return error({ statusCode: 404, message: 'user profile not found' })
      } else {
        app.$toastService.error('error fetching user profile')
      }
    } finally {
      return { profile }
    }
  }

  @debounce
  async toggleEditMode(save: boolean = true) {
    let success = true

    if (this.editMode && save) {
      success = await this.$profileService.updateProfile(this.profile.user)
    }

    if (success) {
      this.editMode = !this.editMode
    }
  }

  @debounce
  onArtworkCardClicked(artwork: any) {
    const idOrSlug = artwork.slug || artwork.id
    this.$router.push(`/${this.profile.user.username}/${idOrSlug}`)
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
