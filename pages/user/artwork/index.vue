<template>
  <div>
    <h2>My Artwork</h2>
    <nuxt-link to="/user/artwork/upload">Upload New</nuxt-link>
  </div>
</template>

<script type="ts">
export default {
  middleware: 'role/artist'
}
</script>
