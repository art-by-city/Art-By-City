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
          <th class="text-left text-lowercase">Visibility</th>
          <th class="text-left text-lowercase">Disabled</th>
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
            <v-checkbox v-model="city.visible" :disabled="editCity !== idx"></v-checkbox>
          </td>
          <td class="text-lowercase">
            <v-checkbox v-model="city.disabled" :disabled="editCity !== idx"></v-checkbox>
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
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'

@Component({
  middleware: 'role/admin'
})
export default class AdminCitiesPage extends FormPageComponent {
  breadcrumbs = [
    {
      text: 'Admin',
      disabled: false,
      href: '/admin'
    },
    {
      text: 'Cities',
      disabled: true,
      href: '/admin/cities'
    }
  ]
  cities: any[] = []
  editCity: null | number = null

  async asyncData({ $axios }: Context) {
    const errors = []
    let cities = [] as any[]

    try {
      const citiesResponse = await $axios.$get('/api/admin/cities')
      cities = citiesResponse.payload || []
    } catch (error) {
      errors.push(error.response?.data?.messages)
    }

    return { errors, cities}
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
    this.cities.push({ code: '', name: '', country: 'USA', visible: false, disabled: true })
    this.editCity = this.cities.length - 1
  }
}
</script>
