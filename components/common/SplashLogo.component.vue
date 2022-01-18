<template>
  <v-img
    :src="src"
    max-width="960px"
    contain
    class="mt-16 mx-auto"
    @click="onClick"
  ></v-img>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class SplashLogo extends Vue {
  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly dark: boolean | undefined

  @Emit('click') onClick() {}

  get src() {
    return this.dark
      ? 'logo/logo_by_daliah_ammar_dark_transparent.png'
      : 'logo/logo_by_daliah_ammar_transparent.png'
  }
}
</script>
