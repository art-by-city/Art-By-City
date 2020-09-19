<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'
import ToastService from '~/services/toast/service'
import ProgressService from '~/services/progress/service'
import { debounce } from '~/helpers/helpers'

@Component({
  middleware: 'role/admin',
  layout: 'admin'
})
export default class AdminCitiesPage extends FormPageComponent {
  cities: any[] = []
  editCity: null | number = null

  async asyncData({ $axios }: Context) {
    let cities = [] as any[]

    try {
      const citiesResponse = await $axios.$get('/api/admin/cities')
      cities = citiesResponse.payload || []
    } catch (error) {
      ToastService.error(`error fetching cities: ${error}`)
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
        ToastService.success('city saved')
      }
    } catch (error) {
      ToastService.error(`Error saving city: ${error}`)
    }
    ProgressService.stop()
  }

  @debounce
  async deleteCity(city: any, idx: number) {
    ProgressService.start()
    try {
      let success = false
      if (city.id) {
        success = await this.$axios.$delete(`/api/city/${city.id}`)
      } else {
        success = true
      }

      if (success) {
        this.editCity = null
        this.cities.splice(idx, 1)
        ToastService.success('city deleted')
      }
    } catch (error) {
      ToastService.error(`Error saving city: ${error}`)
    }
    ProgressService.stop()
  }

  @debounce
  addCity() {
    this.cities.push({ code: '', name: '', country: 'USA', visible: false, disabled: true })
    this.editCity = this.cities.length - 1
  }
}
</script>
