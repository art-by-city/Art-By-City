<template>
  <v-tooltip top>
    <template v-slot:activator="activator">
      <span
        v-on="activator.on"
        class="text-caption font-italic"
      >
        {{ date | humanDateDiff }}
      </span>
    </template>
    <span>{{ date | localeDate }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class DateWithTooltip extends Vue {
  @Prop({ type: [String, Number] }) readonly date!: string | number

  @Prop({ type: String, required: false, default: '' }) contentClass!: string
}
</script>

