<template>
  <div>
    <h1>ADMIN AREA</h1>
    <template v-if="hasErrors">
      <v-alert v-for="(error, i) in errors" :key="i" type="error" dense>
        {{ error }}
      </v-alert>
    </template>

    <v-alert v-if="success" type="success" dense>
      User saved
    </v-alert>

    <v-simple-table>
      <thead>
        <tr>
          <th class="text-left">ID</th>
          <th class="text-left">Username</th>
          <th class="text-left">Roles</th>
          <th class="text-left">Save</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>
            <v-combobox
              v-model="user.roles"
              :items="roles"
              multiple
            ></v-combobox>
          </td>
          <td>
            <v-btn text color="primary" @click="saveUser(user)">
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
export default class AdminIndexPage extends FormPageComponent {
  roles = ['admin', 'artist']
  users: any[] = []

  async asyncData({ $axios }: Context) {
    try {
      const { users } = await $axios.$get('/api/admin/users')

      return { users }
    } catch (error) {
      return { errors: error.response.data.messages }
    }
  }

  async saveUser(user: any) {
    this.errors = []
    this.success = false
    try {
      this.success = await this.$axios.$post('/api/admin/user', { user })
    } catch (error) {
      this.errors = error.response.data.messages
    }
  }
}
</script>
