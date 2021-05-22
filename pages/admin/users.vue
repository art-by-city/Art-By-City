<template>
  <div class="admin-users-page">
    <v-data-table
      :headers="headers"
      :items="users"
      item-key="id"
      :search="searchTerm"
      calculate-widths
      dense
    >
      <template v-slot:item.username="props">
        <nuxt-link :to="`/${props.item.username}`">
          {{ props.item.username}}
        </nuxt-link>
      </template>
      <template v-slot:item.city="props">
        <span>{{ cityName(citiesById[props.item.city]) || '' }}</span>
      </template>
      <template v-slot:item.roles="props">
        <v-combobox
          v-model="props.item.roles"
          :items="roles"
          multiple
        ></v-combobox>
      </template>
      <template v-slot:item.actions="props">
        <v-btn
          text
          color="primary"
          class="text-lowercase"
          @click="saveUser(user)"
        >
          Save
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'
import ProgressService from '~/services/progress/service'
import { debounce } from '~/helpers/helpers'

@Component({
  middleware: 'role/admin',
  layout: 'admin'
})
export default class AdminUserPage extends FormPageComponent {
  roles = ['admin', 'artist', 'crypto']
  users: any[] = []
  citiesById: any = {}
  searchTerm: string = ''
  headers = [
    { text: 'id', value: 'id' },
    { text: 'username', value: 'username' },
    { text: 'email', value: 'email' },
    { text: 'city', value: 'city' },
    { text: 'roles', value: 'roles' },
    { text: 'actions', value: 'actions' }
  ]

  cityName(city: any) {
    return city?.code || ''
  }

  async asyncData({ $axios, app, store }: Context) {
    let users = [] as any[]

    try {
      const usersResponse = await $axios.$get('/api/admin/users')
      users = usersResponse.payload || []
    } catch (error) {
      app.$toastService.error(`error fetching: ${error}`)
    }

    const citiesById: any = {}
    store.state.config.cities.forEach((city: any) => {
      citiesById[city.id] = city
    })

    return { users, citiesById }
  }

  @debounce
  async saveUser(user: any) {
    ProgressService.start()
    try {
      const success = await this.$axios.$post('/api/admin/user', { user })

      if (success) {
        this.$toastService.success('user saved')
      }
    } catch (error) {
      this.$toastService.error(`Error saving user: ${error}`)
    }
    ProgressService.stop()
  }
}
</script>
