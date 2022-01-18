<template>
  <v-progress-linear
    v-intersect="onIntersect"
    :indeterminate="pending"
    color="black"
    background-color="transparent"
    height="1"
    bottom
    class="my-2"
  ></v-progress-linear>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class FeedLoadMore extends Vue {
  @Prop({
    type: Boolean,
    required: false
  }) readonly pending!: boolean

  // NB: Uses Intersection Observer API
  // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
  @Emit('intersect') onIntersect(entries: { isIntersecting: Boolean }[]) {
    const isIntersecting = entries[0].isIntersecting

    return isIntersecting
  }
}
</script>
