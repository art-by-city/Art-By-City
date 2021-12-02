<template>
  <div class="discover-page">
    <FeedComponent />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import FeedComponent from '~/components/feed/Feed.component.vue'

@Component({
  components: {
    FeedComponent
  }
})
export default class DiscoverPage extends Vue {}
</script>
