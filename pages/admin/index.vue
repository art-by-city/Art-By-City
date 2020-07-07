<template>
  <div>
    <h1 class="text-lowercase">
      <v-icon color="black" large>mdi-account-cowboy-hat</v-icon>
      ADMIN AREA
    </h1>
    <template v-if="hasErrors">
      <v-alert v-for="(error, i) in errors" :key="i" type="error" dense>
        {{ error }}
      </v-alert>
    </template>

    <v-alert v-if="success" type="success" dense>
      Success
    </v-alert>

    <v-tabs v-model="tab" icons-and-text>
      <v-tab class="text-lowercase">
        Users
        <v-icon>mdi-table-account</v-icon>
      </v-tab>
      <v-tab class="text-lowercase">
        Cities
        <v-icon>mdi-map</v-icon>
      </v-tab>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-simple-table dense fixed-header>
            <thead>
              <tr>
                <th class="text-left text-lowercase">ID</th>
                <th class="text-left text-lowercase">Username</th>
                <th class="text-left text-lowercase">City</th>
                <th class="text-left text-lowercase">Roles</th>
                <th class="text-left text-lowercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
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
        </v-tab-item>
        <v-tab-item>
          <v-simple-table fixed-header>
            <thead>
              <tr>
                <th>
                  <v-btn icon @click="addCity()">
                    <v-icon>mdi-plus-box</v-icon>
                  </v-btn>
                </th>
              </tr>
              <tr>
                <th class="text-left text-lowercase">Country</th>
                <th class="text-left text-lowercase">Code</th>
                <th class="text-left text-lowercase">Name</th>
                <th class="text-left text-lowercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(city, idx) in cities" :key="city.id">
                <td style="width: 100px" class="text-lowercase">
                  {{ city.country }}
                </td>
                <td style="width: 100px" class="text-lowercase">
                  <template v-if="editCity !== idx">
                    {{ city.code }}
                  </template>
                  <template v-else>
                    <v-text-field
                      v-model="city.code"
                      type="text"
                      class="text-lowercase"
                    ></v-text-field>
                  </template>
                </td>
                <td class="text-lowercase">
                  <template v-if="editCity !== idx">
                    {{ city.name }}
                  </template>
                  <template v-else>
                    <v-text-field
                      v-model="city.name"
                      type="text"
                      class="text-lowercase"
                    ></v-text-field>
                  </template>
                </td>
                <td class="text-lowercase">
                  <template v-if="editCity !== idx">
                    <v-btn icon @click="editCity = idx">
                      <v-icon>mdi-square-edit-outline</v-icon>
                    </v-btn>
                  </template>
                  <template v-else>
                    <v-btn icon @click="saveCity(city)">
                      <v-icon>mdi-content-save</v-icon>
                    </v-btn>
                    <v-btn icon @click="editCity = null">
                      <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-btn icon @click="deleteCity(city, idx)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
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
  cities: any[] = []
  tab = 2
  editCity: null | number = null

  async asyncData({ $axios }: Context) {
    const errors = []
    let users = [] as any[]
    let cities = [] as any[]

    try {
      const usersResponse = await $axios.$get('/api/admin/users')
      users = usersResponse.users || []

      const citiesResponse = await $axios.$get('/api/city')
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

  async saveCity(city: any) {
    this.errors = []
    this.success = false
    try {
      if (!city.id) {
        this.success = await this.$axios.$put('/api/city', { city })
      } else {
        this.success = await this.$axios.$post(`/api/city/${city.id}`, { city })
      }
      if (this.success) {
        this.editCity = null
      }
    } catch (error) {
      console.error(`Error saving city: ${error}`)
      this.errors = error?.response?.data?.messages
    }
  }

  async deleteCity(city: any, idx: number) {
    this.errors = []
    this.success = false
    try {
      if (city.id) {
        this.success = await this.$axios.$delete(`/api/city/${city.id}`)
      } else {
        this.success = true
      }

      this.cities.splice(idx, 1)
    } catch (error) {
      console.error(`Error saving city: ${error}`)
      this.errors = error?.response?.data?.messages
    }
  }

  addCity() {
    this.cities.push({ code: '', name: '', country: 'USA' })
    this.editCity = this.cities.length - 1
  }
}
</script>
