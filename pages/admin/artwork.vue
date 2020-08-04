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
      v-model="artworkSearchTerm"
      append-icon="mdi-filter"
      label="Filter"
      single-line
      hide-details
    ></v-text-field>
    <v-data-table
      :headers="artworkHeaders"
      :items="artworks"
      item-key="id"
      :search="artworkSearchTerm"
      calculate-widths
      dense
      show-expand
    >
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <strong>Description:</strong> {{ item.description }}
          <br />
          <strong>Hashtags: </strong> {{ item.hashtags.join(', ') }}
          <br />
          <strong>Images:</strong>
          <v-img
            v-for="(image, i) in item.images"
            :key="i"
            :src="`/artwork-images/${image.source}`"
            width="100"
            height="100"
          ></v-img>
        </td>
      </template>

      <template v-slot:item.created="{ item }">
        <span>{{ new Date(item.created).toLocaleString() }}</span>
      </template>
      <template v-slot:item.updated="{ item }">
        <span>{{ new Date(item.updated).toLocaleString() }}</span>
      </template>
      <template v-slot:item.owner="{ item }">
        <span>{{ item.owner.username }}</span>
      </template>
      <template v-slot:item.city="{ item }">
        <span>{{ resolveCityNameFromId(item.city) }}</span>
      </template>
      <template v-slot:item.hashtags="{ item }">
        <span>{{ item.hashtags.slice(0, 3).join(', ') }}</span>
      </template>
      <template v-slot:item.published="{ item }">
        <v-simple-checkbox v-model="item.published" disabled></v-simple-checkbox>
      </template>
      <template v-slot:item.approved="{ item }">
        <v-simple-checkbox v-model="item.approved" disabled></v-simple-checkbox>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'
import { ConfigStoreState } from '~/store/config'

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
      text: 'Artwork',
      disabled: true,
      href: '/admin/artwork'
    }
  ]
  artworkHeaders = [
    { text: 'id',          value: 'id'          },
    { text: 'created',     value: 'created',    },
    { text: 'updated',     value: 'updated',    },
    { text: 'title',       value: 'title',  },
    { text: 'owner',       value: 'owner',      },
    // { text: 'description', value: 'description' },
    { text: 'type',        value: 'type',       },
    { text: 'city',        value: 'city',       },
    { text: 'hashtags',    value: 'hashtags', width: '150'  },
    // { text: 'images',      value: 'images',     },
    { text: 'likes',       value: 'likes',      },
    { text: 'published',   value: 'published',  },
    { text: 'approved',    value: 'approved',   },
    { text: '',            value: 'data-table-expand' },
  ]
  artworks: any[] = []
  artworkSearchTerm: string = ''
  config: ConfigStoreState = { cities: [], hashtags: [] }

  async asyncData({ $axios, store }: Context) {
    const errors = []
    let config: ConfigStoreState = { cities: [], hashtags: [] }
    let artworks = [] as any[]

    try {
      artworks = await $axios.$get('/api/admin/artwork')
      config = await $axios.$get('/api/config')
      store.commit('config/setConfig', config)
    } catch (error) {
      errors.push(error.response?.data?.messages)
    }

    return { errors, artworks, config }
  }

  _citiesById: any = null
  resolveCityNameFromId(cityId: string) {
    if (!this._citiesById) {
      this._citiesById = {}
      this.config.cities.forEach((city: any) => {
        this._citiesById[city.id] = city
      })
    }

    return this._citiesById[cityId].code || ''
  }
}
</script>
