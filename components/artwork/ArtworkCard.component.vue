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
                v-if="!disabled && (hover || isPlayable)"
                absolute
                class="artwork-overlay fill-height"
              >
                <div v-if="isPlayable" id="playIcon">
                  <v-icon x-large>
                    {{ isModel ? 'mdi-rotate-3d' : 'mdi-play' }}
                  </v-icon>
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
import { Vue, Component, Prop } from 'nuxt-property-decorator'

import { Artwork, Profile } from '~/app/core'

@Component
export default class ArtworkCard extends Vue {
  @Prop({
    required: true
  })
  txId!: string

  @Prop()
  disabled?: boolean

  artwork: Artwork | null = null
  profile: Profile | null = null
  username: string | null = null

  get href(): string {
    if (this.artwork) {
      const address = typeof this.artwork.creator === 'string'
        ? this.artwork.creator
        : this.artwork.creator.address
      const creatorUrl = this.username || address
      const artworkUrl = this.artwork.slug || this.artwork.id

      return `/${creatorUrl}/${artworkUrl}`
    }

    return ''
  }

  get isPlayable(): boolean {
    if (this.artwork) {
      if ('images' in this.artwork) {
        return !!this.artwork.images[0].animated
      } else if (
        'audio' in this.artwork
        || 'model' in this.artwork
      ) {
        return true
      }
    }

    return false
  }

  get isAudio(): boolean {
    return !!this.artwork && 'audio' in this.artwork
  }

  get isModel(): boolean {
    return !!this.artwork && 'model' in this.artwork
  }

  get displayName() {
    if (this.profile?.displayName) {
      return this.profile?.displayName
    }

    if (this.username) {
      return `@${this.username}`
    }

    return this.artwork
      ? typeof this.artwork.creator === 'string'
        ? this.artwork.creator
        : this.artwork.creator.address
      : ''
  }

  fetchOnServer = false
  async fetch() {
    this.artwork = await this.$artworkService.fetch(this.txId)

    if (this.artwork) {
      const address = typeof this.artwork.creator === 'string'
        ? this.artwork.creator
        : this.artwork.creator.address
      this.profile = await this.$profileService.fetchProfile(address)

      this.username = await this.$usernameService.resolveUsername(address)
    }
  }

  private artworkUrlFromId(id: string) {
    return `${this.$arweaveService.config.gateway}/${id}`
  }

  // TODO -> could this be a getter?
  src() {
    if (this.artwork) {
      if ('images' in this.artwork && this.artwork.images.length > 0) {
        return this.artworkUrlFromId(this.artwork.images[0].preview)
      } else if ('image' in this.artwork) {
        return this.artworkUrlFromId(this.artwork.image.preview)
      }
    }

    return ''
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
