<template>
  <v-container fluid>
    <v-row>
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
                        <v-icon color="success">mdi-check</v-icon>
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
            <v-btn small icon color="error" @click="closeArtworkTypeEditModal">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-btn small icon color="success" @click="onArtworkTypeEditModalSaveClicked">
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-col cols="4">
        <v-form ref="form">
          <v-card flat outlined>
            <v-card-title>app config</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="maxUserArtworks"
                outlined
                type="number"
                label="Max User Artworks"
                class="text-lowercase"
                name="maxUserArtworks"
                autocomplete="off"
              ></v-text-field>
            </v-card-text>
          </v-card>

          <v-card flat outlined>
            <v-card-title>artwork types</v-card-title>
            <v-card-text>
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
                      <v-btn small icon color="success" @click="openArtworkTypeEditModal()">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tfoot>
              </v-simple-table>
            </v-card-text>
          </v-card>

          <v-card flat>
            <v-card-actions>
              <v-btn
                type="submit"
                color="primary"
                class="text-lowercase"
                @click.prevent="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'
import ArtworkType from '~/models/artwork/artworkType'
import ProgressService from '~/services/progress/service'
import { debounce } from '~/helpers/helpers'

@Component({
  middleware: 'role/admin',
  layout: 'admin'
})
export default class AdminConfigPage extends FormPageComponent {
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

  @debounce
  async onArtworkTypeEditModalSaveClicked() {
    // TODO -> check for successful result
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

  @debounce
  async save() {
    ProgressService.start()
    try {
      const success = await this.$axios.$post('/api/config', {
        maxUserArtworks: this.maxUserArtworks,
        artworkTypes: this.artworkTypes
      })

      if (success) {
        this.$toastService.success('config saved')
      }
    } catch (error) {
      this.$toastService.error(`error saving config: ${error}`)
    }
    ProgressService.stop()
  }
}
</script>
