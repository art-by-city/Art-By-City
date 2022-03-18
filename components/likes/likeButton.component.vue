<template>
  <span class="like-button">
    <v-btn
      class="like-icon px-0"
      :ripple="{ class: 'red--text' }"
      color="black"
      text
      max-width="36"
      min-width="36"
      @click="toggleLike"
    >
      <v-icon :color="color">{{ icon }}</v-icon>
    </v-btn>
    <v-btn
      class="like-count"
      text
      mid-width="64"
      :disabled="totalLikes < 1"
      @click="showLikedByPopup"
    >
      <span
        v-if="totalLikes > 0"
        :style="`color: ${color};`"
      >
        {{ totalLikes }}
        <!-- <span v-if="isSubmittingLikeTx">+1</span> -->
      </span>
    </v-btn>
    <v-dialog
      :value="popupOpen"
      width="400"
      persistent
      @click:outside="onCloseDialog"
    >
      <v-container dense class="pa-1">
        <v-row dense>
          <v-col dense cols="12" class="pa-0">
            <v-card>
              <v-card-title>Liked By</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <LikedByList :entityTxId="entityTxId" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-dialog>
    <LikeDialog
      :show.sync="showLikeDialog"
      :entityOwner="entityOwner"
      :entityTxId="entityTxId"
      :entityDescription="entityDescription"
      :ownerDisplayName="ownerDisplayName"
      @pending="onLikePending"
    />
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

import { debounce } from '~/helpers'
import LikedByList from './LikedByList.component.vue'
import LikeDialog from './LikeDialog.component.vue'

@Component({
  components: {
    LikedByList,
    LikeDialog
  }
})
export default class LikeButton extends Vue {
  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly dark: boolean | undefined

  @Prop({
    type: String,
    required: true
  }) readonly entityTxId!: string

  @Prop({
    type: String,
    required: true
  }) readonly entityOwner!: string

  @Prop({
    type: String,
    required: true
  }) entityDescription!: string

  @Prop({
    type: String,
    required: true
  }) ownerDisplayName!: string

  private isLiked: boolean = false
  private totalLikes: number = 0
  private popupOpen: boolean = false
  private isResolvingIsLiked: boolean = true
  private isSubmittingLikeTx: boolean = false
  private isUploading: boolean = false
  private showLikeDialog: boolean = false

  get color() {
    if (this.isLiked) {
      return 'red'
    }

    if (this.dark) {
      return 'white'
    }

    return 'black'
  }

  get icon() {
    if (
      this.isUploading
        || this.isResolvingIsLiked
        || this.isSubmittingLikeTx
    ) {
      return 'mdi-heart-pulse'
    }

    if (this.isLiked) {
      return 'mdi-heart'
    }

    return 'mdi-heart-outline'
  }

  private fetchOnServer: boolean = false
  async fetch() {
    this.isSubmittingLikeTx = this.$auth.loggedIn
      && this.$accessor.transactions.listProcessing.some(
        (tx) => {
          return tx.type === 'like'
            && this.entityOwner === tx.target
            && this.entityTxId === tx.entityId
        }
      )

    if (!this.isSubmittingLikeTx && this.$auth.loggedIn) {
      this.isLiked = await this.$likesService.isEntityLikedBy(
        this.entityTxId,
        this.$auth.user.address
      )
    }

    this.isResolvingIsLiked = false

    await this.fetchLikeCount()
  }

  created() {
    this.$nuxt.$on('like-CONFIRMED', (entityTxId: string) => {
      if (this.entityTxId === entityTxId) {
        this.isLiked = true
        this.isSubmittingLikeTx = false
        this.fetchLikeCount()
      }
    })

    this.$nuxt.$on('like-DROPPED', (entityTxId: string) => {
      if (this.entityTxId === entityTxId) {
        this.isSubmittingLikeTx = false
      }
    })
  }

  onLikePending(isPending: boolean) {
    this.isSubmittingLikeTx = isPending
  }

  @debounce
  async toggleLike() {
    if (!this.isLiked && !this.isResolvingIsLiked && !this.isSubmittingLikeTx) {
      this.showLikeDialog = true
    }
  }

  @debounce
  showLikedByPopup() {
    this.popupOpen = true
  }

  @debounce
  onCloseDialog() {
    this.popupOpen = false
  }

  private async fetchLikeCount() {
    this.totalLikes = await this.$likesService.fetchTotalLikes(this.entityTxId)
  }
}
</script>

<style scoped>
.like-count {
  justify-content: left;
  padding-right: 0px !important;
  padding-left: 6px !important;
}
</style>
