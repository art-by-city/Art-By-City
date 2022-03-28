<template>
  <p
    :style="style"
    class="overflow-hidden click noselect"
    :class="{ 'open': open, 'mb-0': dense }"
    @click="toggle"
  >
    <slot></slot>
  </p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { debounce } from '~/app/util'

@Component
export default class ExpandParagraph extends Vue {
  @Prop({
    type: [String, Number],
    required: false,
    default: '100px'
  }) readonly maxHeight!: string | number

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly dense!: boolean

  get style() {
    return this.open ? '' : `height: ${this.maxHeight}`
  }

  open: boolean = false

  @debounce
  toggle() {
    this.open = !this.open
  }
}
</script>

<style scoped>
  .open {
    height: unset;
  }

  .click {
    cursor: pointer;
  }

  .noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and FF */
  }
</style>
