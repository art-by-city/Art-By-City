<template>
  <v-container class="stats-page">
    <v-row dense justify="center">
      <h1>Art By City Stats</h1>
    </v-row>
    <v-row dense justify="center">
      <template v-if="summary">
        <v-col
          v-for="(stat, i) in Object.keys(summary)"
          :key="i"
          cols="12" sm="8" offset-sm="2"
        >
          <template v-if="isWintstonStringStat(stat)">
            <b>{{ stat }}:</b> <CurrencyEstimate :winston="summary[stat]" />
          </template>
          <template v-else>
            <b>{{ stat }}:</b> {{ summary[stat] }}
          </template>
        </v-col>
      </template>
      <template v-else>Loading...</template>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { StatsSummary } from '~/app/core'

@Component({
  middleware: ['auth', 'role/admin']
})
export default class AdminStatsPage extends Vue {
  summary: StatsSummary | null = null

  private isWintstonStringStat(statName: string) {
    return [
      'likesTotal',
      'tipsTotal',
      'networkFees'
    ].includes(statName)
  }

  fetchOnServer = false
  async fetch() {
    this.summary = await this.$statsService.fetchSummary()
  }
}
</script>