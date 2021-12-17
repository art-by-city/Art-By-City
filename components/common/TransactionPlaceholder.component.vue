<template>
  <v-container fluid>
    <v-row
      class="fill-height ma-0"
      align="center"
      align-content="center"
      justify="center"
    >
      <v-col
        cols="12"
        class="font-weight-md-thin scale-text text-center"
      >
        {{ txId }}
      </v-col>

      <v-col cols="12">
        <v-progress-linear
          indeterminate
          color="black"
          background-color="transparent"
          height="1"
          bottom
        ></v-progress-linear>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class TransactionPlaceholder extends Vue {
  @Prop({
    required: true
  })
  txId!: string
}
</script>

<style scoped>
.scale-text {
  font-size: 2.75vmin;
  word-break: break-all;
}
</style>
