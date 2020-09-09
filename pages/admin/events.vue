<template>
  <div>
    <v-breadcrumbs large :items="breadcrumbs"></v-breadcrumbs>

    <v-text-field
      v-model="eventLogSearch"
      append-icon="mdi-filter"
      label="Filter"
      single-line
      hide-details
    ></v-text-field>
    <v-data-table
      :headers="eventLogHeaders"
      :items="events"
      item-key="id"
      :search="eventLogSearch"
      calculate-widths
      dense
    >
      <template v-slot:item.timestamp="props">
        <DateWithTooltip :date="props.item.timestamp" />
      </template>
      <template v-slot:item.user="props">
        {{ props.item.user.id }}
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'
import ToastService from '~/services/toast/service'

@Component({
  middleware: 'role/admin'
})
export default class AdminEventsPage extends FormPageComponent {
  breadcrumbs = [
    {
      text: 'Admin',
      disabled: false,
      href: '/admin'
    },
    {
      text: 'Event Log',
      disabled: true,
      href: '/admin/events'
    }
  ]
  events: any[] = []
  eventLogHeaders = [
    { text: 'id', value: 'id', width: '250' },
    { text: 'timestamp', value: 'timestamp', width: '250' },
    { text: 'user', value: 'user', width: '250' },
    { text: 'type', value: 'type', width: '250' },
  ]
  eventLogSearch = ''

  async asyncData({ $axios }: Context) {
    let events = [] as any[]

    try {
      const analyticsResponse = await $axios.$get('/api/analytics/events')
      events = analyticsResponse.payload || []
    } catch (error) {
      ToastService.error(`error fetching events: ${error}`)
    }

    return { events }
  }
}
</script>