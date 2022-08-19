<template>
  <v-container fluid>

    <!-- Title & Likes -->
    <v-row dense>
      <v-col cols="8" md="9" lg="10" class="pa-0">
        <span class="text-h4 text-md-h2 text-sm-h3 font-weight-medium">
          {{ artwork.title }}
        </span>
      </v-col>

      <v-col cols="4" md="3" lg="2">
        <LikeButton
          :disabled="!$auth.isLoggedIn || $auth.user && creator === $auth.user.address"
          :entityOwner="creator"
          :entityTxId="artwork.id"
          :entityDescription="artwork.title"
          :ownerDisplayName="displayName"
        />
      </v-col>
    </v-row>

    <!-- Creator -->
    <v-row dense>
      <v-col cols="12" class="pa-0">
        <nuxt-link
          :to="`/${username || artwork.creator.address || artwork.creator}`"
          class="text-truncate font-italic black--text"
        >
          {{ displayName }}
        </nuxt-link>
      </v-col>
    </v-row>

    <!-- Description -->
    <v-row dense v-if="artwork.description">
      <v-col cols="12">
        {{ artwork.description }}
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12" lg="6">
        <v-tabs v-model="tab" color="black">
          <v-tabs-slider color="black"></v-tabs-slider>
          <v-tab>Metadata</v-tab>
          <v-tab v-if="isOwner">Asset Links</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <!-- Metadata -->
          <v-tab-item transition="fade">
            <v-simple-table dense>
              <tbody>

                <!-- Created -->
                <tr v-if="artwork.created">
                  <td class="font-weight-bold">Created</td>
                  <td>{{ artwork.created }}</td>
                </tr>

                <!-- Medium -->
                <tr v-if="artwork.medium">
                  <td class="font-weight-bold">Medium</td>
                  <td>{{ artwork.medium }}</td>
                </tr>

                <!-- Genre -->
                <tr v-if="artwork.genre">
                  <td class="font-weight-bold">Genre</td>
                  <td>{{ artwork.genre }}</td>
                </tr>

                <!-- City -->
                <tr v-if="artwork.city">
                  <td class="font-weight-bold">City</td>
                  <td class="text-uppercase">{{ artwork.city }}</td>
                </tr>

                <!-- Published -->
                <tr>
                  <td class="font-weight-bold">Published</td>
                  <td>
                    {{ (new Date(artwork.published)).toLocaleDateString() }}
                  </td>
                </tr>

                <!-- License -->
                <tr v-if="artwork.license">
                  <td class="font-weight-bold">License</td>
                  <td>
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
                  </td>
                </tr>

                <!-- Transaction -->
                <tr>
                  <td class="font-weight-bold">Transaction</td>
                  <td>
                    <a
                      :href="`https://viewblock.io/arweave/tx/${artwork.id}`"
                      target="_blank"
                      class="black--text"
                    >
                      {{ artwork.id }}
                      <v-icon
                        small
                        dense
                        class="adjust-icon text-decoration-none"
                      >
                        mdi-open-in-new
                      </v-icon>
                    </a>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-tab-item>

          <!-- Asset Links -->
          <v-tab-item v-if="isOwner" transition="fade">
            <v-simple-table dense>
              <tbody>
                <tr v-for="(asset, i) in assets" :key="i">
                  <td class="font-weight-bold">{{ asset.label }}</td>
                  <td>
                    <a
                      :href="`https://viewblock.io/arweave/tx/${asset.id}`"
                      target="_blank"
                      class="black--text"
                    >
                      {{ asset.id }}
                      <v-icon
                        small
                        dense
                        class="adjust-icon text-decoration-none"
                      >
                        mdi-open-in-new
                      </v-icon>
                    </a>
                  </td>
                  <td>
                    <v-btn
                      icon
                      small
                      tile
                      @click="copyAssetUrlToClipboard(asset.id)"
                    >
                      <v-icon small dense>mdi-content-copy</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-tab-item>
        </v-tabs-items>
      </v-col>

      <v-col cols="12" lg="2">
        <v-tabs v-model="tab2" color="black">
          <v-tabs-slider color="black"></v-tabs-slider>
          <v-tab>Stats</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab2">
          <!-- Stats -->
          <v-tab-item transition="fade">
            <v-simple-table dense>
              <tbody>
                <!-- Views -->
                <tr>
                  <td class="font-weight-bold">Views</td>
                  <td>{{ artwork.views }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-tab-item>
        </v-tabs-items>

        <ArweaveSeal />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { Artwork, Profile } from '~/app/core'
import { debounce } from '~/app/util'
import LikeButton from '~/components/likes/likeButton.component.vue'

@Component({
  components: {
    LikeButton
  }
})
export default class ArtworkMetadata extends Vue {
  tab = null
  tab2 = null

  @Prop({
    type: Object,
    required: true
  }) readonly artwork!: Artwork

  @Prop({
    type: Object,
    required: false,
    default: undefined
  }) readonly profile?: Profile

  @Prop({
    type: String,
    required: false,
    default: undefined
  }) readonly username?: string

  get creator() {
    return this.artwork
      ? typeof this.artwork.creator === 'string'
        ? this.artwork.creator
        : this.artwork.creator.address
      : ''
  }

  get isOwner() {
    return this.$auth.loggedIn && this.$auth.user.address === this.creator
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

  get assets() {
    const assets = [
      { label: 'Manifest', id: this.artwork.id }
    ]

    if ('audio' in this.artwork) {
      assets.push({ label: 'Audio', id: this.artwork.audio.audio })
    }

    if ('model' in this.artwork) {
      assets.push({ label: 'Model', id: this.artwork.model.model })
    }

    if ('image' in this.artwork) {
      assets.push(
        { label: 'Image', id: this.artwork.image.image },
        { label: 'Image 4K (JPEG)', id: this.artwork.image.preview4k },
        { label: 'Image HD (JPEG)', id: this.artwork.image.preview }
      )
    } else if ('images' in this.artwork) {
      for (let i = 0; i < this.artwork.images.length; i++) {
        assets.push(
          { label: `Original [${i}]`, id: this.artwork.images[i].image },
          { label: `4K (JPEG) [${i}]`, id: this.artwork.images[i].preview4k },
          { label: `HD (JPEG) [${i}]`, id: this.artwork.images[i].preview }
        )
      }
    }

    return assets
  }

  arweaveAssetUrlFromId(id: string): string {
    return `https://arweave.net/${id}`
  }

  @debounce
  async copyAssetUrlToClipboard(id: string) {
    await navigator.clipboard.writeText(this.arweaveAssetUrlFromId(id))
    this.$toasts.success('Copied URL to clipboard!')
  }
}
</script>

<style scoped>
.adjust-icon {
  margin-top: -5px;
}
</style>
