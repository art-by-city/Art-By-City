<template>
  <div class="admin-cities-page">
    <v-data-table
      :headers="headers"
      :items="cities"
      item-key="id"
      :search="searchTerm"
      calculate-widths
      dense
    >
      <template v-slot:top>
        <v-toolbar dense elevation="0">
          <v-btn icon color="success" @click="addCity()">
            <v-icon>mdi-plus-box</v-icon>
          </v-btn>
          <v-text-field
            v-model="searchTerm"
            append-icon="mdi-filter"
            label="filter cities"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
      </template>
      <template v-slot:item.code="{ item }">
        <template v-if="editCity !== item.id">
          {{ item.code }}
        </template>
        <template v-else>
          <v-text-field
            v-model="item.code"
            type="text"
            class="text-lowercase"
          ></v-text-field>
        </template>
      </template>
      <template v-slot:item.name="{ item }">
        <template v-if="editCity !== item.id">
          {{ item.name }}
        </template>
        <template v-else>
          <v-text-field
            v-model="item.name"
            type="text"
            class="text-lowercase"
          ></v-text-field>
        </template>
      </template>
      <template v-slot:item.disabled="{ item }">
        <v-checkbox
          v-model="item.disabled"
          :disabled="editCity !== item.id"
        ></v-checkbox>
      </template>
      <template v-slot:item.visible="{ item }">
        <v-checkbox
          v-model="item.visible"
          :disabled="editCity !== item.id"
        ></v-checkbox>
      </template>
      <template v-slot:item.actions="{ item }">
        <template v-if="editCity !== item.id">
          <v-btn icon @click="editCity = item.id">
            <v-icon>mdi-square-edit-outline</v-icon>
          </v-btn>
        </template>
        <template v-else>
          <v-btn icon @click="saveCity(item)">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
          <v-btn icon @click="editCity = null">
            <v-icon>mdi-cancel</v-icon>
          </v-btn>
          <v-btn icon @click="deleteCity(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
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
export default class AdminCitiesPage extends FormPageComponent {
  cities: any[] = []
  editCity: null | string = null
  searchTerm: string = ''
  headers = [
    { text: 'country', value: 'country' },
    { text: 'code', value: 'code' },
    { text: 'name', value: 'name' },
    { text: 'disabled', value: 'disabled' },
    { text: 'visibile', value: 'visible' },
    { text: 'actions', value: 'actions' }
  ]

  async asyncData({ $axios, app }: Context) {
    let cities = [] as any[]

    try {
      const citiesResponse = await $axios.$get('/api/admin/cities')
      cities = citiesResponse.payload || []
    } catch (error) {
      app.$toastService.error(`error fetching cities: ${error}`)
    }
    return { cities }
  }

  @debounce
  async saveCity(city: any) {
    ProgressService.start()
    try {
      let success = false
      if (!city.id) {
        success = await this.$axios.$put('/api/city', { city })
      } else {
        success = await this.$axios.$post(`/api/city/${city.id}`, { city })
      }

      if (success) {
        this.editCity = null
        this.$toastService.success('city saved')
      }
    } catch (error) {
      this.$toastService.error(`Error saving city: ${error}`)
    }
    ProgressService.stop()
  }

  @debounce
  async deleteCity(city: any) {
    ProgressService.start()
    try {
      let success = false
      if (city.id) {
        success = await this.$axios.$delete(`/api/city/${city.id}`)
      } else {
        success = true
      }

      if (success) {
        let idx = -1
        for (let i = 0; i < this.cities.length; i++) {
          if (this.cities[i].id === city.id) {
            idx = i
          }
        }
        if (idx >= 0) {
          this.cities.splice(idx, 1)
          this.$toastService.success('city deleted')
        }
        this.editCity = null
      }
    } catch (error) {
      this.$toastService.error(`Error saving city: ${error}`)
    }
    ProgressService.stop()
  }

  @debounce
  addCity() {
    this.cities.push({
      id: '',
      code: '',
      name: '',
      country: 'USA',
      visible: false,
      disabled: true
    })
    this.editCity = ''
  }
}
</script>
