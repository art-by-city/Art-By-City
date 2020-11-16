<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4">
        <v-card flat outlined>
          <v-card-title>city selector</v-card-title>
          <v-card-text>
            <CitySelector
              v-model="city"
              :cities="$store.state.config.cities"
              :required="isRequired"
            />
          </v-card-text>
        </v-card>

        <v-card flat outlined>
          <v-card-title>artwork type selector</v-card-title>
          <v-card-text>
            <ArtworkTypeSelector
              v-model="artworkType"
              :artworkTypes="$store.state.config.artworkTypes"
              :required="isRequired"
            />
          </v-card-text>
        </v-card>

        <v-card flat outlined>
          <v-card-title>hashtag selector</v-card-title>
          <v-card-text>
            <HashtagSelector
              v-model="hashtags"
              :hashtags="$store.state.config.hashtags"
            />
          </v-card-text>
        </v-card>

        <v-card flat outlined>
          <v-card-title>text input</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="text"
              type="text"
              name="title"
              label="Title"
              class="text-lowercase"
              autocomplete="new-password"
            ></v-text-field>
          </v-card-text>
        </v-card>

        <v-card flat outlined>
          <v-card-title>buttons</v-card-title>
          <v-card-text>
            <v-btn color="primary">primary</v-btn>
            <v-btn color="success">success</v-btn>
            <v-btn color="warning">warning</v-btn>
            <v-btn color="error">error</v-btn>
          </v-card-text>
        </v-card>

        <v-card flat outlined>
          <v-card-title>switch</v-card-title>
          <v-card-text>
            <v-switch
              v-model="isRequired"
              label="required"
              small
            ></v-switch>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card flat outlined>
          <v-card-title>progress bar</v-card-title>
          <v-card-text>
            <v-btn color="success" @click="toggleLoadingOn">on</v-btn>
            <v-btn color="error" @click="toggleLoadingOff">off</v-btn>
          </v-card-text>
        </v-card>
        <v-card flat outlined>
          <v-card-title>toast notifications</v-card-title>
          <v-card-text>
            <v-select
              v-model="toastType"
              label="type"
              :items="toastTypes"
            ></v-select>
            <v-text-field
              v-model="toastText"
              type="text"
              name="message"
              label="message"
              class="text-lowercase"
            ></v-text-field>
            <v-btn :color="toastType" @click="sendToastNotification">go</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="(t, i) in scrollItems"
        :key="i"
        cols="4"
        class="lazy-load-test-col"
      >
        <v-lazy transition="fade-transition">
          {{ i }}
        </v-lazy>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'
import CitySelector from '~/components/forms/citySelector.component.vue'
import ArtworkTypeSelector from '~/components/forms/artworkTypeSelector.component.vue'
import HashtagSelector from '~/components/forms/hashtagSelector.component.vue'
import { debounce } from '~/helpers/helpers'

@Component({
  middleware: 'role/admin',
  layout: 'admin',
  components: {
    CitySelector,
    ArtworkTypeSelector,
    HashtagSelector
  }
})
export default class AdminThemePage extends FormPageComponent {
  isRequired = false
  city = ''
  artworkType = ''
  hashtags = []
  text = ''
  scrollItems = [...Array(15).keys()]
  toastTypes = ['info', 'success', 'warning', 'error']
  toastType: 'info' | 'success' | 'warning' | 'error' = 'info'
  toastText = 'this is a test message'

  @debounce
  toggleLoadingOn() {
    this.$nuxt.$loading.start()
  }

  @debounce
  toggleLoadingOff() {
    this.$nuxt.$loading.finish()
  }

  sendToastNotification() {
    this.$toastService.toast(this.toastText, this.toastType)
  }
}
</script>

<style scoped>
.lazy-load-test-col {
  border: 1px solid black;
  height: 10vw;
  /* width: 10vw; */
}
</style>
