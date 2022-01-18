<template></template>

<script lang="ts">
import { Vue, Component, PropSync } from 'nuxt-property-decorator'

import { debounce } from '~/helpers'
import TransactionFormControls from
  '~/components/forms/transactionFormControls.component.vue'

@Component({
  components: {
    TransactionFormControls
  }
})
export default class TransactionDialog extends Vue {
  isUploading: boolean = false
  asset: any | null = null

  @PropSync('show', {
    type: Boolean,
    required: false
  }) open?: boolean

  close() {
    this.open = false
    // this.asset = null
    this.isUploading = false
  }

  @debounce
  onCloseDialog() {
    if (!this.isUploading) {
      this.close()
    }
  }

  onCancel() {
    this.close()
  }
}
</script>
