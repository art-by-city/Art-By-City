<template>
  <div class="index-page">
    <PitchContent />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import PitchContent from '~/components/pitch/PitchContent.component.vue'

@Component({
  components: {
    PitchContent
  }
})
export default class HomePage extends Vue {
  head() {
    return {
      meta: [
        { property: 'og:title', content: 'Art By City' },
        {
          property: 'og:image',
          content:
            `${this.$config.baseUrl}/logo/logo_by_daliah_ammar_square.png`
        },
        { property: 'og:type', content: 'website' }
      ]
    }
  }
}
</script>

<style scoped>
.pitch-content {
  margin-top: -48px;
}
</style>
