<template>
  <div>
    <v-container v-if="artwork">
      <v-row v-if="previewImage" dense justify="center" class="pa-0 pb-1">
        <v-img
          class="preview-artwork"
          :class="{ 'animated': previewImage.animated }"
          max-height="75vh"
          max-width="75vw"
          :src="previewSrc"
          :lazy-src="artworkUrlFromId(previewImage.preview4k)"
          contain
          @click="onPreviewArtworkClicked"
        >
          <template v-slot:placeholder>
            <TransactionPlaceholder :txId="previewImage.preview4k" />
          </template>
          <v-overlay absolute :value="showAnimationOverlay">
            <v-btn x-large icon @click.prevent="showAnimation = true">
              <v-icon>mdi-play</v-icon>
            </v-btn>
          </v-overlay>
        </v-img>
      </v-row>
      <v-row
        v-if="artwork.images && artwork.images.length > 1"
        justify="center"
        dense
      >
        <div class="artwork-image-selector-container">
          <div
            class="artwork-image-selector"
            v-for="(image, i) in artwork.images"
            :key="i"
          >
            <v-img
              aspect-ratio="1.7"
              :src="artworkUrlFromId(image.preview4k || image.preview)"
              class="clickable"
              :class="{
                'highlighted': image.preview === previewImage
                  || (previewImage && image.guid === previewImage.image.guid)
              }"
              @click="setPreviewImage(i)"
            >
              <template v-slot:placeholder>
                <TransactionPlaceholder :txId="image.preview" />
              </template>
            </v-img>
          </div>
        </div>
      </v-row>
      <v-row dense justify="center">
        <v-col cols="10">
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col offset-sm="2" cols="12" sm="5">
          <v-row dense>
            <span class="text-h4 text-sm-h2">{{ artwork.title }}</span>
          </v-row>
          <v-row dense>
            <strong>Created by</strong>
            &nbsp;
            <nuxt-link
              :to="`/${username || artwork.creator.address || artwork.creator}`"
              class="text-truncate"
            >
              {{ displayName }}
            </nuxt-link>
          </v-row>
          <v-row dense v-if="artwork.views">
            <strong>Views</strong>
            &nbsp;
            <span>{{ artwork.views }}</span>
          </v-row>
          <v-row dense v-if="artwork.created">
            <strong>Created</strong>
            &nbsp;
            <span>{{ artwork.created }}</span>
          </v-row>
          <v-row dense v-if="artwork.city">
            <strong>City</strong>
            &nbsp;
            <span class="text-uppercase">{{ artwork.city }}</span>
          </v-row>
          <v-row dense v-if="artwork.medium">
            <strong>Medium</strong>
            &nbsp;
            <span>{{ artwork.medium }}</span>
          </v-row>
          <v-row dense v-if="artwork.published">
            <strong>Published</strong>
            &nbsp;
            <span>
              {{ (new Date(artwork.published)).toLocaleDateString() }}
            </span>
          </v-row>
          <v-row dense>
            <strong>Transaction ID</strong>
            &nbsp;
            <span class="text-truncate">{{ artwork.id }}</span>
            &nbsp;
            <a
              :href="`https://viewblock.io/arweave/tx/${artwork.id}`"
              target="_blank"
              class="license-anchor"
            >
              ViewBlock
              <v-icon small dense class="adjust-icon">
                mdi-open-in-new
              </v-icon>
            </a>
          </v-row>
          <v-row dense v-if="artwork.license">
            <strong>License</strong>
            &nbsp;
            <span>{{ artwork.license.name }}</span>
            &nbsp;
            <a
              :href="artwork.license.reference"
              target="_blank"
              class="license-anchor"
            >
              Learn More
              <v-icon small dense class="adjust-icon">
                mdi-open-in-new
              </v-icon>
            </a>
          </v-row>
          <v-row dense v-if="artwork.description">
            <strong>Description</strong>
            <div style="width: 100%">
              {{ artwork.description }}
            </div>
          </v-row>
        </v-col>
        <v-col cols="5">
          <div
            v-if="$auth.loggedIn && $auth.user.address"
            style="align-self: flex-end"
          >
            <LikeButton
              :disabled="creator === $auth.user.address"
              :entityOwner="creator"
              :entityTxId="artwork.id"
              :entityDescription="artwork.title"
              :ownerDisplayName="displayName"
            />
          </div>
        </v-col>
      </v-row>

      <ArtworkZoomDialog
        v-if="previewImage"
        :show.sync="zoom"
        :src="artworkUrlFromId(previewImage.image) ||''"
      />
    </v-container>
    <v-container v-else>
      <v-row justify="center">
        <v-col cols="auto">
          <template v-if="tx">
            <TransactionConfirmationProgress :utx="tx" @confirmed="$fetch" />
          </template>
          <template v-if="!tx && !$fetchState.pending">
            <h1>404 Artwork Not Found</h1>
            <p>
              The requested Artwork could not be found either because it doesn't
              exist or it hasn't yet been indexed and cached by an Arweave
              Gateway.
            </p>
            <p>
              It may take upwards of 8 hours for Arweave Gateways to index and
              cache Artwork.
            </p>
            <p>
              You can
              <v-btn
                text
                outlined
                :disabled="$fetchState.pending"
                @click="debouncedFetch"
              >
                click to refresh
              </v-btn>
              and see if the Artwork is available.
            </p>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import LikeButton from '~/components/likes/likeButton.component.vue'
import ArtworkZoomDialog from
  '~/components/artwork/ArtworkZoomDialog.component.vue'
import { ArtworkEditForm } from '~/components/artwork/edit'
import TransactionConfirmationProgress from
  '~/components/common/TransactionConfirmationProgress.component.vue'
import {
  Artwork,
  LegacyArtwork,
  LegacyArtworkImage,
  Profile,
  ArtworkImageWithPreviews
  } from '~/app/core'
import { UserTransaction, SetUserTransactionStatusPayload } from '~/app/ui'
import { debounce } from '~/app/util'
import { SET_TRANSACTION_STATUS } from '~/store/transactions/mutations'

@Component({
  components: {
    LikeButton,
    ArtworkZoomDialog,
    ArtworkEditForm,
    TransactionConfirmationProgress
  }
})
export default class ArtworkPage extends Vue {
  head() {
    if (!this.artwork) { return {} }
    const creator = this.artwork.version === 0
      ? this.artwork.creator.address
      : this.artwork.creator
    const usernameOrAddress = this.username || creator
    const txIdOrSlug = this.artwork.slug || this.artwork.id

    const title = `${this.artwork.title} by ${this.displayName}`
    const url =
      `${this.$config.baseUrl}/${usernameOrAddress}/${txIdOrSlug}`
    const thumbnailUrl = this.$config.arweave.gateway
      + '/'
      + this.artwork.images[0].preview
    const twitter = this.profile?.twitter || ''

    return {
      title,
      meta: [
        // Open Graph
        { property: 'og:title',        content: title                    },
        { property: 'og:description',  content: this.artwork.description },
        { property: 'og:type',         content: 'artbycity:artwork'      },
        { property: 'og:url',          content: url                      },
        { property: 'og:image',        content: thumbnailUrl             },
        { property: 'og:image:alt',    content: this.artwork.description },
        // { property: 'og:image:type',   content: ''                       },
        // { property: 'og:image:width',  content: ''                       },
        // { property: 'og:image:height', content: ''                       },

        // Twitter
        { name: 'twitter:card',    content: 'summary_large_image' },
        { name: 'twitter:creator', content: `@${twitter}`         },
      ]
    }
  }

  artwork: Artwork | LegacyArtwork | null = null
  profile: Profile | null = null
  username: string | null = null
  previewImage: ArtworkImageWithPreviews | LegacyArtworkImage | null = null
  zoom = false
  txIdOrSlug: string = this.$route.params.artwork
  txId?: string
  tx: UserTransaction | null = null
  showAnimation: boolean = false

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

  get creator() {
    return this.artwork
      ? this.artwork.version === 0
        ? this.artwork.creator.address
        : this.artwork.creator
      : ''
  }

  get previewSrc() {
    if (this.previewImage && this.artwork) {
      const preview = this.previewImage as ArtworkImageWithPreviews
      return this.artworkUrlFromId(
        preview.animated && this.showAnimation
          ? preview.image
          : preview.preview4k
      )
    } else {
      return ''
    }
  }

  get showAnimationOverlay(): boolean {
    return !!(
      !this.showAnimation
      && (this.previewImage as any).animated
    )
  }

  @debounce
  debouncedFetch() {
    this.$fetch()
  }

  async fetch() {
    try {
      const { username, address } = await this.$usernameService.resolve(
        this.$route.params.username
      )

      if (!address) {
        this.$router.replace('/')
      } else {
        const artwork = await this.$artworkService.fetchByTxIdOrSlug(
          this.$route.params.artwork,
          address
        )

        if (artwork) {
          this.artwork = artwork
          this.username = username || null
          this.profile = await this.$profileService.fetchProfile(address)
          this.setPreviewImage()
          if (this.$route.query.txId) {
            this.$router.replace(
              `/${this.$route.params.username}/${this.$route.params.artwork}`
            )
          }
        } else if (this.$route.query.txId) {
          this.txId = this.$route.query.txId.toString()
          this.tx = this.$accessor.transactions.getById(this.txId)
          this.$store.subscribe(async (mutation) => {
            if (mutation.type === `transactions/${SET_TRANSACTION_STATUS}`) {
              const payload = mutation.payload as SetUserTransactionStatusPayload
              if (payload.type === 'artwork' && payload.id === this.txId) {
                if (payload.status === 'CONFIRMED') {
                  this.$fetch()
                } else {
                  this.tx = this.$accessor.transactions.getById(this.txId)
                }
              }
            }
          })
        }
      }
    } catch (error) {
      console.error(error)
      this.$toasts.error(error)
    }
  }

  artworkUrlFromId(id: string): string {
    return `${this.$arweaveService.config.gateway}/${id}`
  }

  setPreviewImage(index?: number) {
    if (!index) {
      index = 0
    }

    if (this.artwork && this.artwork.images.length - 1 >= index) {
      this.previewImage = this.artwork.images[index]
    }
  }

  @debounce
  onPreviewArtworkClicked() {
    if (this.previewImage) {
      const preview = this.previewImage as ArtworkImageWithPreviews
      if (preview.animated) {
        // NB: This will load in the animation file
        this.showAnimation = true
      } else {
        this.zoom = true
      }
    }
  }
}
</script>

<style scoped>
.preview-artwork {
  cursor: zoom-in;
}
.preview-artwork.animated {
  cursor: unset;
}
.clickable {
  cursor: pointer;
}
.highlighted {
  border: 2px solid black;
}
.artwork-image-selector {
  height: 56px;
  width: 96px;
  margin: 5px;
  display: inline-block;
}
.adjust-icon {
  margin-top: -3px;
}
</style>
