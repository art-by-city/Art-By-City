<template>
  <v-img
    src="logo/logo_by_daliah_ammar_dark_transparent.png"
    max-width="960px"
    contain
    class="mt-16 mx-auto"
  ></v-img>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'nuxt-property-decorator'

@Component
export default class SplashLogo extends Vue {
  expanded: boolean = false

  @Emit('click') onClick() {}
}
</script>
