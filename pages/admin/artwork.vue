<template>
  <div>
    <v-breadcrumbs large :items="breadcrumbs"></v-breadcrumbs>

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
      <template v-slot:item.id="{ item }">
        <nuxt-link :to="`/artwork/${item.id}`" >{{ item.id }}</nuxt-link>
      </template>
      <template v-slot:item.created="{ item }">
        <span>{{ new Date(item.created).toLocaleString() }}</span>
      </template>
      <template v-slot:item.updated="{ item }">
        <span>{{ new Date(item.updated).toLocaleString() }}</span>
      </template>
      <template v-slot:item.owner="{ item }">
        <nuxt-link :to="`/user/${item.owner.username}`">
          {{ item.owner.username }}
        </nuxt-link>
      </template>
      <template v-slot:item.city="{ item }">
        <span>{{ resolveCityNameFromId(item.city) }}</span>
      </template>
      <template v-slot:item.hashtags="{ item }">
        <span>{{ item.hashtags.slice(0, 3).join(', ') }}</span>
      </template>
      <template v-slot:item.likes="{ item }">
        <span v-if="item.likes">{{ item.likes.length }}</span>
        <span v-else>0</span>
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
import { ConfigStoreState, DefaultConfigStoreState } from '~/store/config'
import ToastService from '~/services/toast/service'

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
  config: ConfigStoreState = DefaultConfigStoreState

  async asyncData({ $axios, store }: Context) {
    let config: ConfigStoreState = DefaultConfigStoreState
    let artworks = [] as any[]

    try {
      const artworksResponse = await $axios.$get('/api/admin/artwork')
      artworks = artworksResponse.payload || []
      config = await $axios.$get('/api/config')
      store.commit('config/setConfig', config)
    } catch (error) {
      ToastService.error(`error fetching artwork: ${error}`)
    }

    return { artworks, config }
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
