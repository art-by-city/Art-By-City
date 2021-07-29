<template>
  <v-chip
    v-ripple="{ class: 'red--text' }"
    color="rgba(0,0,0,0)"
    @click.stop="toggleLike"
  >
    <v-icon small :color="color()">{{ icon() }}</v-icon>
    &nbsp;
    <span v-if="totalLikes() > 0">{{ totalLikes() }}</span>
  </v-chip>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model } from 'nuxt-property-decorator'

import { debounce } from '~/helpers/helpers'
import User, { getUser } from '../models/user/user'

interface Artwork {
  id: string
  likes: string[]
}

@Component
export default class LikeButton extends Vue {
  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly dark: boolean | undefined

  @Model('change', { type: Object, required: true }) artwork!: Artwork

  get user(): User | null {
    return getUser(this.$auth.user)
  }

  @debounce
  toggleLike() {
    // if (!this.artwork.likes) {
    //   this.artwork.likes = []
    // }

    // if (this.user) {
    //   if (!this.artwork.likes.includes(this.user.id)) {
    //     this.artwork.likes.push(this.user.id)
    //     try {
    //       this.$axios.$put(`/api/artwork/${this.artwork.id}/like`)
    //     } catch (error) {
    //       this.$toastService.error('error liking artwork')
    //     }
    //   } else {
    //     try {
    //       this.$axios.$delete(`/api/artwork/${this.artwork.id}/like`)
    //     } catch (error) {
    //       this.$toastService.error('error unliking artwork')
    //     }
    //     this.artwork.likes = this.artwork.likes.filter((id: string) => {
    //       return this.user && id !== this.user.id
    //     })
    //   }
    // }

    // this.$forceUpdate()
  }

  color() {
    if (this.isLiked()) {
      return 'red'
    } else if (this.dark) {
      return 'white'
    } else {
      return 'black'
    }
  }

  icon() {
    if (this.isLiked()) {
      return 'mdi-heart'
    } else {
      return 'mdi-heart-outline'
    }
  }

  isLiked() {
    // if (this.user && this.artwork.likes?.includes(this.user.id)) {
    //   return true
    // }

    return false
  }

  totalLikes() {
    return this.artwork.likes?.length || ''
  }
}
</script>
