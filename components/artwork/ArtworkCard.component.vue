<template>
  <div class="artwork-card">
    <v-hover :disabled="disabled">
      <template v-slot:default="{ hover }">
        <v-card tile elevation="2" :to="href">
          <v-img
            :src="src()"
            aspect-ratio="1"
          >
            <template v-slot:placeholder>
              <TransactionPlaceholder :txId="txId" />
            </template>

            <v-fade-transition>
              <v-overlay
                v-if="!disabled && (hover || isAnimated)"
                absolute
                class="artwork-overlay fill-height"
              >
                <div v-if="isAnimated" id="playIcon">
                  <v-icon x-large>mdi-play</v-icon>
                </div>
                <v-row align="end" class="fill-height pa-1 pl-4">
                  <v-col
                    cols="auto"
                    class="
                      artwork-overlay-title-container
                      disable-text-highlighting
                    "
                  >
                    <div
                      v-if="disabled"
                      class="artwork-card-disable-overlay"
                    ></div>
                    <template v-if="hover">
                      <a class="artwork-card-title white--text">
                        {{ artwork ? artwork.title : '' }}
                      </a>
                      <br />
                      <a
                        class="
                          artwork-card-title
                          white--text
                          font-italic
                          font-weight-thin
                        "
                      >
                        {{ displayName }}
                      </a>
                    </template>
                  </v-col>
                </v-row>
              </v-overlay>
            </v-fade-transition>
          </v-img>
        </v-card>
      </template>
    </v-hover>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'

import { Artwork, LegacyArtwork, Profile } from '~/app/core'
import { debounce } from '~/app/util'

@Component
export default class ArtworkCard extends Vue {
  @Prop({
    required: true
  })
  txId!: string

  @Prop()
  disabled?: boolean

  get href(): string {
    if (this.artwork) {
      const address = this.artwork.version === 0
        ? this.artwork.creator.address
        : this.artwork.creator
      const creatorUrl = this.username || address
      const artworkUrl = this.artwork.slug || this.artwork.id

      return `/${creatorUrl}/${artworkUrl}`
    }

    return ''
  }

  artwork: Artwork | LegacyArtwork | null = null
  profile: Profile | null = null
  username: string | null = null

  artworkUrlFromId(id: string) {
    return `${this.$arweaveService.config.gateway}/${id}`
  }

  src() {
    if (this.artwork && this.artwork.images.length > 0) {
      return this.artworkUrlFromId(this.artwork.images[0].preview)
    }

    return ''
  }

  get isAnimated(): boolean {
    return !!(this.artwork && this.artwork.images[0].animated)
  }

  get displayName() {
    if (this.profile?.displayName) {
      return this.profile?.displayName
    }

    if (this.username) {
      return `@${this.username}`
    }

    return this.artwork
      ? this.artwork.version === 0
        ? this.artwork.creator.address
        : this.artwork.creator
      : ''
  }

  fetchOnServer = false
  async fetch() {
    this.artwork = await this.$artworkService.fetch(this.txId)

    if (this.artwork) {
      const address = this.artwork.version === 0
        ? this.artwork.creator.address
        : this.artwork.creator
      this.profile = await this.$profileService.fetchProfile(address)

      this.username = await this.$usernameService.resolveUsername(address)
    }
  }
}
</script>

<style scoped>
.artwork-overlay >>> div.v-overlay__content {
  height: 100%;
  width: 100%;
}
.artwork-overlay div.artwork-container {
  height: 100%;
}
.artwork-overlay-title-container {
  padding-bottom: 2px;
}
.artwork-card-disable-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 8990;
}

#playIcon {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -24px;
}
</style>
