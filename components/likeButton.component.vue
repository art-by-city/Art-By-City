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

interface Artwork {
  id: string
  likes: string[]
}

@Component
export default class LikeButton extends Vue {
  @Prop({ type: Boolean }) readonly dark!: boolean

  @Model('change', { type: Object, required: true }) artwork!: Artwork

  toggleLike() {
    if (!this.artwork.likes) {
      this.artwork.likes = []
    }

    if (!this.artwork.likes.includes(this.$auth.user.id)) {
      this.artwork.likes.push(this.$auth.user.id)
      try {
        this.$axios.$put(`/api/artwork/${this.artwork.id}/like`)
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        this.$axios.$delete(`/api/artwork/${this.artwork.id}/like`)
      } catch (error) {
        console.error(error)
      }
      this.artwork.likes = this.artwork.likes.filter((id: string) => {
        return id !== this.$auth.user.id
      })
    }

    this.$forceUpdate()
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
    if (this.artwork.likes?.includes(this.$auth.user.id)) {
      return true
    }

    return false
  }

  totalLikes() {
    return this.artwork.likes?.length || ''
  }
}
</script>
