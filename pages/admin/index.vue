<template>
  <div></div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'

import FormPageComponent from '~/components/pages/formPage.component'

@Component({
  middleware: 'role/admin',
  layout: 'admin'
})
export default class AdminIndexPage extends FormPageComponent {}
</script>
