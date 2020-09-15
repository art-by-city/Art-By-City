<template>
  <div>
    admin index
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'

@Component({
  middleware: 'role/admin',
  layout: 'admin'
})
export default class AdminIndexPage extends FormPageComponent {}
</script>
