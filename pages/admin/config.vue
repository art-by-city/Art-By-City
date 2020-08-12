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

    <v-container fluid>
      <v-row justify="center">
        <v-col cols="4">
          <v-form ref="form">
            <v-text-field
              v-model="maxUserArtworks"
              type="text"
              label="Max User Artworks"
              class="text-lowercase"
              name="maxUserArtworks"
              autocomplete="off"
            ></v-text-field>
            <v-btn type="submit" color="primary" class="text-lowercase" @click.prevent="save">
              Save
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'

@Component({
  middleware: 'role/admin'
})
export default class AdminConfigPage extends FormPageComponent {
  breadcrumbs = [
    {
      text: 'Admin',
      disabled: false,
      href: '/admin'
    },
    {
      text: 'Config',
      disabled: true,
      href: '/admin/config'
    }
  ]

  maxUserArtworks: number = 0

  async asyncData({ $axios }: Context) {
    const errors = []
    let maxUserArtworks: number = 0

    try {
      const config = await $axios.$get('/api/config')
      maxUserArtworks = config.maxUserArtworks
    } catch (error) {
      errors.push(error.response?.data?.messages)
    }

    return { errors, maxUserArtworks }
  }

  async save() {
    this.errors = []
    this.success = false
    try {
      this.success = await this.$axios.$post('/api/config', {
        maxUserArtworks: this.maxUserArtworks
      })
    } catch (error) {
      console.error(`Error saving config: ${error}`)
      this.errors = error?.response?.data?.messages
    }
  }
}
</script>
