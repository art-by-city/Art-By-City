<template>
  <div>
    <v-container v-if="artwork">
      <v-row v-if="previewImage" dense justify="center" class="pa-0 pb-1">
        <v-img
          class="preview-artwork"
          max-height="75vh"
          max-width="75vw"
          :src="previewImage.dataUrl"
          contain
          @click="onPreviewArtworkClicked"
        ></v-img>
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
              :src="image.dataUrl"
              class="clickable"
              :class="{ 'highlighted': image === previewImage }"
              @click="setPreviewImage(image)"
            >
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
            <nuxt-link :to="`/${artwork.creator.address}`" class="text-truncate">
              {{ username }}
            </nuxt-link>
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
          <div v-if="$auth.loggedIn" style="align-self: flex-end">
            <LikeButton
              :entityOwner="artwork.creator.address"
              :entityTxId="artwork.id"
            />
          </div>
          <!--
            <div class="text-lowercase">{{ artwork.type }}</div>
            <div class="text-lowercase">{{ hashtagsString }}</div>
          -->
        </v-col>
      </v-row>

      <ArtworkZoomDialog
        v-if="previewImage"
        :show.sync="zoom"
        :src="previewImage.dataUrl"
      />
    </v-container>
    <v-container v-else>
      <v-row justify="center">
        <v-col cols="auto">
          <template v-if="tx">
            <TransactionConfirmationProgress :tx="tx" />
          </template>
          <template v-else>
            <!-- <h1>404 Artwork not found :(</h1> -->
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'

import LikeButton from '~/components/likeButton.component.vue'
import FormPageComponent from '~/components/pages/formPage.component'
import ArtworkZoomDialog from
  '~/components/artwork/ArtworkZoomDialog.component.vue'
import {
  ArtworkEditControls,
  ArtworkEditForm
} from '~/components/artwork/edit'
import TransactionConfirmationProgress from
  '~/components/common/TransactionConfirmationProgress.component.vue'
import {
  Artwork,
  ArtworkImage,
  UserTransaction,
  SetUserTransactionStatusPayload,
  Profile
  } from '~/types'
import { debounce } from '~/helpers'
import { SET_TRANSACTION_STATUS } from '~/store/transactions/mutations'
import ProgressService from '~/services/progress/service'

@Component({
  components: {
    LikeButton,
    ArtworkZoomDialog,
    ArtworkEditControls,
    ArtworkEditForm,
    TransactionConfirmationProgress
  }
})
export default class ArtworkPage extends FormPageComponent {
  head() {
    const head: any = { meta: [] }
    const username = this.$route.params.username

    if (this.artwork) {
      const displayName = this.profile?.displayName || username
      const slugOrTxId = this.artwork.slug || this.artwork.id

      head.title = `${this.artwork.title} by ${displayName}`
      head.meta.push(
        { property: 'og:title', content: this.artwork.title },
        { property: 'og:type', content: 'artbycity:artwork' },
        {
          property: 'og:url',
          content: `${this.$config.baseUrl}/${username}/${slugOrTxId}`
        }
      )

      // TODO -> need directly linkable image, e.g. bundles
      // head.meta.push({ property: 'og:image', content: '' })

      if (this.artwork.description) {
        head.meta.push({
          property: 'og:description',
          content: this.artwork.description
        })
      }
    }

    return head
  }

  artwork: Artwork | null = null
  profile: Profile | null = null
  previewImage: ArtworkImage | null = null
  cachedArtwork!: Artwork
  zoom = false
  txIdOrSlug: string = this.$route.params.artwork
  txId?: string
  tx: UserTransaction | null = null

  get username() {
    return this.profile?.displayName || this.artwork?.creator.address || ''
  }

  async fetch() {
    ProgressService.start()
    try {
      const artwork = await this.$artworkService.fetchByTxIdOrSlug(
        this.txIdOrSlug,
        this.$route.params.username
      )

      if (artwork) {
        this.artwork = artwork
        this.profile = await this.$profileService.fetchProfile(
          this.artwork.creator.address
        )
        this.setPreviewImage()
      } else {
        this.txId = this.txIdOrSlug
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
    } catch (error) {
      console.error(error)
      this.$toastService.error(error)
    } finally {
      ProgressService.stop()
    }
  }

  get hashtagsString() {
    return this.artwork?.hashtags.map(h => `#${h}`).join(', ') || ''
  }

  setPreviewImage(image?: ArtworkImage) {
    if (image) {
      this.previewImage = image
    } else if (
      this.artwork
      && this.artwork.images
      && this.artwork.images.length > 0
    ) {
      this.previewImage = this.artwork.images[0]
    } else {
      this.previewImage = null
    }
  }

  @debounce
  onPreviewArtworkClicked() {
    this.zoom = true
  }
}
</script>

<style scoped>
.preview-artwork {
  cursor: zoom-in;
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
