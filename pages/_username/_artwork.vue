<template>
  <div>
    <v-container v-if="artwork" fluid class="px-0">
      <v-row v-if="previewImage" dense justify="center" class="pa-0 pb-1">
        <template v-if="isModel && showingAnimation">
          <v-col cols="10" class="model-viewer-container">
            <ModelViewer
              :url="artworkUrlFromId(artwork.model.model)"
              type="model/gltf-binary"
            />
          </v-col>

          <v-row dense justify="center">
            <v-banner class="caption" outlined tile>
              <v-icon>mdi-exclamation-thick</v-icon>
              You can click &amp; drag to rotate, right-click to pan, and
              use the mouse wheel to zoom in and out.
            </v-banner>
          </v-row>
        </template>
        <v-img
          v-else
          class="preview-artwork"
          :class="{ 'animated': previewImage.animated || isModel }"
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
            <v-btn x-large icon @click.prevent="showingAnimation = true">
              <v-icon>{{ isModel ? 'mdi-rotate-3d' : 'mdi-play' }}</v-icon>
            </v-btn>
          </v-overlay>
        </v-img>
      </v-row>
      <v-row
        v-if="artwork.audio && artwork.audio.audio"
        justify="center"
        dense
      >
        <audio
          controls
          controlsList="nodownload"
          :src="artworkUrlFromId(artwork.audio.audio)"
        />
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
        <v-col offset-md="2" cols="12" md="8">
          <ArtworkMetadata
            :artwork="artwork"
            :profile="profile || undefined"
            :username="username"
          />
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

import { ArtworkEditForm } from '~/components/artwork/edit'
import TransactionConfirmationProgress from
  '~/components/common/TransactionConfirmationProgress.component.vue'
import {
  ArtworkMetadata,
  ArtworkZoomDialog,
  ModelViewer
} from '~/components/artwork'
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
    ArtworkZoomDialog,
    ArtworkEditForm,
    TransactionConfirmationProgress,
    ModelViewer,
    ArtworkMetadata
  }
})
export default class ArtworkPage extends Vue {
  head() {
    if (!this.artwork) { return {} }

    const creator = typeof this.artwork.creator === 'string'
      ? this.artwork.creator
      : this.artwork.creator.address
    const usernameOrAddress = this.username || creator
    const txIdOrSlug = this.artwork.slug || this.artwork.id

    const title = `${this.artwork.title} by ${this.displayName}`
    const url =
      `${this.$config.baseUrl}/${usernameOrAddress}/${txIdOrSlug}`
    const thumbnailUrl = this.arweaveAssetUrlFromId(
        'images' in this.artwork
          ? this.artwork.images[0].preview
          : this.artwork.image.preview
      )

    const meta = [
      // Open Graph
      { property: 'og:title', content: title },
      { property: 'og:type', content: 'artbycity:artwork' },
      { property: 'og:url', content: url },
      { property: 'og:image', content: thumbnailUrl },
      // { property: 'og:image:type', content: '' },
      // { property: 'og:image:width', content: '' },
      // { property: 'og:image:height', content: '' },

      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
    ]

    if (this.profile?.twitter) {
      meta.push({
        name: 'twitter:creator',
        content: `@${this.profile.twitter}`
      })
    }

    if (this.artwork.description) {
      meta.push(
        { property: 'og:description', content: this.artwork.description },
        { property: 'og:image:alt', content: this.artwork.description }
      )
    }

    if ('audio' in this.artwork) {
      meta.push({
        property: 'og:audio',
        content: this.arweaveAssetUrlFromId(this.artwork.audio.audio)
      })
    }

    return {
      title,
      meta
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
  showingAnimation: boolean = false

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

  get previewSrc() {
    if (this.previewImage && this.artwork) {
      const preview = this.previewImage as ArtworkImageWithPreviews
      return this.artworkUrlFromId(
        preview.animated && this.showingAnimation
          ? preview.image
          : preview.preview4k
      )
    } else {
      return ''
    }
  }

  get isModel(): boolean {
    return !!this.artwork && 'model' in this.artwork
  }

  get showAnimationOverlay(): boolean {
    return !this.showingAnimation
      &&
      (
        (this.previewImage as any).animated
        || (this.artwork && 'model' in this.artwork)
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

  arweaveAssetUrlFromId(id: string): string {
    return `https://arweave.net/${id}`
  }

  artworkUrlFromId(id: string): string {
    return `${this.$arweaveService.config.gateway}/${id}`
  }


  setPreviewImage(index?: number) {
    if (!index) {
      index = 0
    }

    if (this.artwork) {
      if ('images' in this.artwork && this.artwork.images.length - 1 >= index) {
        this.previewImage = this.artwork.images[index]
      } else if ('image' in this.artwork) {
        this.previewImage = this.artwork.image
      }
    }
  }

  @debounce
  onPreviewArtworkClicked() {
    if (this.previewImage) {
      const preview = this.previewImage as ArtworkImageWithPreviews
      if (preview.animated || this.isModel) {
        // NB: This will load in the animation file
        this.showingAnimation = true
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
.model-viewer-container {
  max-height: 75vh;
  max-width: 75vw;
}
</style>
