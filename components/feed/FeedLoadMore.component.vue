<template>
  <div v-intersect="onIntersect" class="feed-load-more">
    <v-btn
      v-if="button"
      v-show="!pending"
      :loading="pending"
      @click="onLoadMoreClicked"
      outlined
      text
    >
      {{ buttonText }}
    </v-btn>
    <v-progress-linear
      v-intersect="onIntersect"
      :indeterminate="pending"
      color="black"
      background-color="transparent"
      height="2"
      bottom
      class="my-2"
    ></v-progress-linear>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class FeedLoadMore extends Vue {
  @Prop({
    type: Boolean,
    required: false
  }) readonly pending!: boolean

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly button!: boolean

  @Prop({
    type: String,
    required: false,
    default: 'Load More'
  }) readonly buttonText!: string

  // NB: Uses Intersection Observer API
  // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
  @Emit('intersect') onIntersect(entries: { isIntersecting: Boolean }[]) {
    const isIntersecting = entries[0].isIntersecting

    return isIntersecting
  }

  @Emit('click')
  onLoadMoreClicked() {}
}
</script>

<style scoped>
.feed-load-more {
  width: 100%;
}
</style>
