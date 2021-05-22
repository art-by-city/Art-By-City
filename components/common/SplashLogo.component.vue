<template>
  <span
    class="splash-logo text-h3 text-sm-h1"
    @click="onClick"
  >
    art x by x city
  </span>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'nuxt-property-decorator'

@Component
export default class SplashLogo extends Vue {
  expanded: boolean = false

  @Emit('click') onClick() {}
}
</script>
