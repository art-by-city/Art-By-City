<template>
  <v-tooltip top>
    <template v-slot:activator="activator">
      <span v-on="activator.on">{{ date | humanDateDiff }}</span>
    </template>
    <span>{{ date | localeDate }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class DateWithTooltip extends Vue {
  @Prop({ type: String }) readonly date!: string
}
</script>

