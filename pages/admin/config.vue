<template>
  <div>
    <v-breadcrumbs large :items="breadcrumbs"></v-breadcrumbs>

    <v-container fluid>
      <v-row justify="center">
        <v-dialog v-model="artworkTypeModalShown" persistent max-width="600px">
          <v-card>
            <v-card-title>artwork type</v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="artworkTypeModalObj.name"
                      label="label"
                      required
                    ></v-text-field>
                    <v-switch v-model="artworkTypeModalObj.visible">
                      <template v-slot:label>
                        <template v-if="artworkTypeModalObj.visible">
                          <v-icon color="black">mdi-eye</v-icon>
                        </template>
                        <template v-else>
                          <v-icon>mdi-eye-off</v-icon>
                        </template>
                      </template>
                    </v-switch>
                    <v-switch v-model="artworkTypeModalObj.enabled">
                      <template v-slot:label>
                        <template v-if="artworkTypeModalObj.enabled">
                          <v-icon color="green">mdi-check</v-icon>
                        </template>
                        <template v-else>
                          <v-icon>mdi-close</v-icon>
                        </template>
                      </template>
                    </v-switch>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small icon color="red" @click="closeArtworkTypeEditModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-btn small icon color="green" @click="onArtworkTypeEditModalSaveClicked">
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

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

            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-lowercase">Artwork Type</th>
                  <th class="text-lowercase">Visible</th>
                  <th class="text-lowercase">Enabled</th>
                  <th class="text-lowercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(artworkType, i) in artworkTypes" :key="i">
                  <td class="text-lowercase">{{ artworkType.name }}</td>
                  <td class="text-lowercase">
                    <v-icon>{{ artworkType.visible ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                  </td>
                  <td class="text-lowercase">
                    <v-icon>{{ artworkType.enabled ? 'mdi-check' : 'mdi-close' }}</v-icon>
                  </td>
                  <td class="text-lowercase">
                    <v-btn small icon @click="openArtworkTypeEditModal(artworkType)">
                      <v-icon>mdi-square-edit-outline</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td class="text-lowercase">
                    <v-btn small icon color="green" @click="openArtworkTypeEditModal()">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tfoot>
            </v-simple-table>

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
import ArtworkType from '~/models/artwork/artworkType'
import ToastService from '~/services/toast/service'
import ProgressService from '~/services/progress/service'

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

  artworkTypeModalShown: boolean = false
  artworkTypeModalObj: ArtworkType = { name: '' }

  maxUserArtworks: number = 0
  artworkTypes: ArtworkType[] = []

  async asyncData({ $axios }: Context) {
    const errors = []
    let maxUserArtworks: number = 0
    let artworkTypes: ArtworkType[] = []

    try {
      const config = await $axios.$get('/api/config')
      maxUserArtworks = config.maxUserArtworks
      artworkTypes = config.artworkTypes || []
    } catch (error) {
      errors.push(error.response?.data?.messages)
    }

    return { errors, maxUserArtworks, artworkTypes }
  }

  async onArtworkTypeEditModalSaveClicked() {
    if (!this.artworkTypes.includes(this.artworkTypeModalObj)) {
      this.artworkTypes.push({ ...this.artworkTypeModalObj })
    }

    await this.save()
    this.closeArtworkTypeEditModal()
  }

  openArtworkTypeEditModal(artworkType?: ArtworkType) {
    if (artworkType) {
      this.artworkTypeModalObj = artworkType
    } else {
      this.artworkTypeModalObj = { name: '' }
    }
    this.artworkTypeModalShown = true
  }

  closeArtworkTypeEditModal() {
    this.artworkTypeModalShown = false
    this.artworkTypeModalObj = { name: '' }
  }

  async save() {
    ProgressService.start()
    try {
      const success = await this.$axios.$post('/api/config', {
        maxUserArtworks: this.maxUserArtworks,
        artworkTypes: this.artworkTypes
      })

      if (success) {
        ToastService.success('config saved')
      }
    } catch (error) {
      ToastService.error(`error saving config: ${error}`)
    }
    ProgressService.stop()
  }
}
</script>
