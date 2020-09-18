<template>
  <div>
    <v-btn @click="inc">{{ count }}</v-btn>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'
import { debounce } from '~/helpers/helpers'

@Component({
  middleware: 'role/admin',
  layout: 'admin'
})
export default class AdminIndexPage extends FormPageComponent {
  count: number = 0

  @debounce
  inc() {
    this.count = this.count + 1
  }
}
</script>
