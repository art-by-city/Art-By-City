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
export default class DiscoverPage extends Vue {
  get head() {
    const title = 'Discover'
    const desc = 'Discover Art published on the Permaweb'

    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'Description',
          content: desc
        },
        { property: 'og:title', content: title },
        { property: 'og:description', content: desc },
        {
          property: 'og:image',
          content:
            `${this.$config.baseUrl}/logo/logo_by_daliah_ammar_square.png`
        },
      ]
    }
  }
}
</script>
