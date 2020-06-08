<template>
  <v-toolbar>
    <v-btn icon @click="onRefreshClicked">
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
    <v-btn icon @click="onGridPreferenceClicked">
      <v-icon v-if="syncedGridSize === 3">mdi-view-week-outline</v-icon>
      <v-icon v-if="syncedGridSize === 6">mdi-view-module-outline</v-icon>
      <v-icon v-if="syncedGridSize === 9">mdi-grid</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import { Vue, Component, Emit, PropSync } from 'nuxt-property-decorator'

@Component
export default class ArtworkExplorerToolbar extends Vue {
  @Emit('refresh') onRefreshClicked() {}

  @PropSync('gridsize', { type: Number }) syncedGridSize!: number

  onGridPreferenceClicked() {
    switch (this.syncedGridSize) {
      case 3:
        this.syncedGridSize = 6
        break
      case 6:
        this.syncedGridSize = 9
        break
      case 9:
      default:
        this.syncedGridSize = 3
    }
  }
}
</script>
