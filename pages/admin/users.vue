<template>
  <v-simple-table dense fixed-header>
    <thead>
      <tr>
        <th class="text-left text-lowercase">ID</th>
        <th class="text-left text-lowercase">Username</th>
        <th class="text-left text-lowercase">Email</th>
        <th class="text-left text-lowercase">City</th>
        <th class="text-left text-lowercase">Roles</th>
        <th class="text-left text-lowercase">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <td class="text-lowercase">{{ user.id }}</td>
        <td class="text-lowercase">
          <nuxt-link :to="`/${user.username}`">
            {{ user.username }}
          </nuxt-link>
        </td>
        <td class="text-lowercase">
          {{ user.email }}
        </td>
        <td>
          <v-select
            v-model="user.city"
            name="city"
            label="City"
            class="text-lowercase"
            :items="cities"
            prepend-icon="mdi-map"
            item-text="name"
            item-value="id"
            item-disabled="disabled"
          >
            <template v-slot:item="{ item }">
              <span class="text-lowercase">{{ item.name }}</span>
            </template>
          </v-select>
        </td>
        <td>
          <v-combobox
            v-model="user.roles"
            :items="roles"
            multiple
          ></v-combobox>
        </td>
        <td>
          <v-btn
            text
            color="primary"
            class="text-lowercase"
            @click="saveUser(user)"
          >
            Save
          </v-btn>
        </td>
      </tr>
    </tbody>
  </v-simple-table>
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
  roles = ['admin', 'artist']
  users: any[] = []
  cities: any[] = []

  async asyncData({ $axios, app }: Context) {
    let users = [] as any[]
    let cities = [] as any[]

    try {
      const usersResponse = await $axios.$get('/api/admin/users')
      users = usersResponse.payload || []
      const citiesResponse = await $axios.$get('/api/admin/cities')
      cities = citiesResponse.payload || []
    } catch (error) {
      app.$toastService.error(`error fetching: ${error}`)
    }

    return { users, cities }
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
