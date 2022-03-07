<template>
  <div class="index-page">
    <PitchContent />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import FeedComponent from '~/components/feed/Feed.component.vue'
import PitchContent from '~/components/pitch/PitchContent.component.vue'

@Component({
  components: {
    FeedComponent,
    PitchContent
  }
})
export default class HomePage extends Vue {}
</script>
