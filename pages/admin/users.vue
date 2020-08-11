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
            <nuxt-link :to="`/user/${user.username}`">
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
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'

@Component({
  middleware: 'role/admin'
})
export default class AdminUserPage extends FormPageComponent {
  breadcrumbs = [
    {
      text: 'Admin',
      disabled: false,
      href: '/admin'
    },
    {
      text: 'Users',
      disabled: true,
      href: '/admin/users'
    }
  ]
  roles = ['admin', 'artist']
  users: any[] = []
  cities: any[] = []

  async asyncData({ $axios }: Context) {
    const errors = []
    let users = [] as any[]
    let cities = [] as any[]

    try {
      const usersResponse = await $axios.$get('/api/admin/users')
      users = usersResponse.payload || []
      const citiesResponse = await $axios.$get('/api/admin/cities')
      cities = citiesResponse.payload || []
    } catch (error) {
      errors.push(error.response?.data?.messages)
    }

    return { errors, users, cities }
  }

  async saveUser(user: any) {
    this.errors = []
    this.success = false
    try {
      this.success = await this.$axios.$post('/api/admin/user', { user })
    } catch (error) {
      console.error(`Error saving user: ${error}`)
      this.errors = error?.response?.data?.messages
    }
  }
}
</script>
