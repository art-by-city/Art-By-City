<template>
  <v-data-table
      :headers="artworkHeaders"
      :items="artworks"
      item-key="id"
      :search="artworkSearchTerm"
      calculate-widths
      dense
      show-expand
    >
      <template v-slot:top>
        <v-toolbar dense elevation="0">
          <v-toolbar-title>artwork</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="artworkSearchTerm"
            append-icon="mdi-filter"
            label="filter artwork"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
      </template>
      <template v-slot:expanded-item="props">
        <td :colspan="props.headers.length">
          <strong>Description:</strong> {{ props.item.description }}
          <br />
          <strong>Hashtags: </strong> {{ props.item.hashtags.join(', ') }}
          <br />
          <strong>Images:</strong>
          <v-img
            v-for="(image, i) in props.item.images"
            :key="i"
            :src="`/artwork-images/${image.source}`"
            width="100"
            height="100"
          ></v-img>
        </td>
      </template>
      <template v-slot:item.id="props">
        <nuxt-link :to="`/artwork/${props.item.id}`" >{{ props.item.id }}</nuxt-link>
      </template>
      <template v-slot:item.created="props">
        <DateWithTooltip :date="props.item.created" />
      </template>
      <template v-slot:item.updated="props">
        <DateWithTooltip :date="props.item.updated" />
      </template>
      <template v-slot:item.owner="props">
        <nuxt-link :to="`/user/${props.item.owner.username}`">
          {{ props.item.owner.username }}
        </nuxt-link>
      </template>
      <template v-slot:item.city="props">
        <span>{{ resolveCityNameFromId(props.item.city) }}</span>
      </template>
      <template v-slot:item.hashtags="props">
        <span>{{ props.item.hashtags.slice(0, 3).join(', ') }}</span>
      </template>
      <template v-slot:item.likes="props">
        <span v-if="props.item.likes">{{ props.item.likes.length }}</span>
        <span v-else>0</span>
      </template>
      <template v-slot:item.published="props">
        <v-simple-checkbox v-model="props.item.published" disabled></v-simple-checkbox>
      </template>
      <template v-slot:item.approved="props">
        <v-simple-checkbox v-model="props.item.approved" disabled></v-simple-checkbox>
      </template>
  </v-data-table>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'
import { ConfigStoreState, DefaultConfigStoreState } from '~/store/config'
import ToastService from '~/services/toast/service'

@Component({
  middleware: 'role/admin',
  layout: 'admin'
})
export default class AdminEventsPage extends FormPageComponent {
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
