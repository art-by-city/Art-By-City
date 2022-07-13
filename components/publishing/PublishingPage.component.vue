<template></template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class PublishingPage extends Vue {
  isUploading: boolean = false

  beforeRouteLeave(to: any, from: any, next: Function) {
    if (!this.isUploading) {
      next()
    } else {
      alert('Cannot navigate away while publication upload is in progress.')
    }
  }

  onSave() {
    const profileUrl = this.$auth.user.username || this.$auth.user.address
    if (profileUrl) {
      this.$router.push(`/${profileUrl}?publishSuccess=true`)
    }
  }

  onCancel() {
    if (confirm('Are you sure you want to cancel this publication?')) {
      this.$router.back()
    }
  }

  onUploading(isUploading: boolean) {
    this.isUploading = isUploading
  }
}
</script>
