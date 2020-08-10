<template>
  <div>
    <v-breadcrumbs large :items="breadcrumbs"></v-breadcrumbs>

    <template v-if="hasErrors">
      <v-alert v-for="(error, i) in errors" :key="i" type="error" dense>
        {{ error }}
      </v-alert>
    </template>

    <v-alert v-if="success" type="success" dense>
      Success
    </v-alert>

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
      <template v-slot:item.timestamp="{ item }">
        {{ (new Date(item.timestamp)).toLocaleString() }}
      </template>
      <template v-slot:item.user="{ item }">
        {{ item.user.id }}
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'

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
    const errors = []
    let events = [] as any[]

    try {
      const analyticsResponse = await $axios.$get('/api/analytics/events')
      events = analyticsResponse.payload || []
    } catch (error) {
      errors.push(error.response?.data?.messages)
    }

    return { errors, events }
  }
}
</script>