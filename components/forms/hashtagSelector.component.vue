<template>
  <div id="hashtagSelector" class="hashtag-selector condensed-input">
    <v-combobox
      v-bind:value="value"
      class="condensed-input"
      name="hashtags"
      label="hashtags"
      multiple
      chips
      outlined
      single-line
      :items="filteredHashtags"
      no-filter
      hide-selected
      :search-input.sync="hashtagSearchInput"
      @input="onHashtagInput"
      @update:search-input="onHashtagUpdateSearchInput"
      attach="#hashtagSelector"
      :rules="rules"
    >
      <template v-slot:selection="data">
        <v-chip
          :key="JSON.stringify(data.item)"
          v-bind="data.attrs"
          :input-value="data.selected"
          :disabled="data.disabled"
          close
          pill
          small
          class="text-lowercase"
          @click:close="data.parent.selectItem(data.item)"
        >
          # {{ data.item }}
        </v-chip>
      </template>
    </v-combobox>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from 'nuxt-property-decorator'
import Fuse from 'fuse.js'

const MAX_HASHTAG_LENGTH = 32

@Component
export default class HashtagSelector extends Vue {
  @Model('input', { type: Array, required: true }) value!: string[]
  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly disabled!: boolean
  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) readonly required: boolean | undefined
  @Prop({ type: Number, default: 12 }) readonly maxSelectable!: number
  @Prop({ type: Array }) readonly hashtags!: string[]

  filteredHashtags: string[] = this.hashtags
  fuzzyHashtags = new Fuse(this.filteredHashtags, { includeScore: true })
  hashtagSearchInput: string = ''

  get rules() {
    return [(hashtags: string[] = []) => {
      if (this.required && hashtags.length < 1) {
        return `hashtags is required`
      }

      for (let i = 0; i < hashtags.length; i++) {
        if (hashtags[i].length > MAX_HASHTAG_LENGTH) {
          return `hashtags must be no more than ${MAX_HASHTAG_LENGTH} characters`
        }
      }

      return true
    }]
  }

  onHashtagInput(hashtags: string[]) {
    this.hashtagSearchInput = ''
    if (hashtags.length > this.maxSelectable) {
      hashtags.pop()
    } else {
      this.$emit('input', hashtags.map((h) => {
        return h[0] === '#' ? h.slice(1) : h
      }))
    }
  }

  onHashtagUpdateSearchInput(value: string) {
    if (!value) {
      this.filteredHashtags = []
    } else {
      const result = this.fuzzyHashtags.search(value)

      this.filteredHashtags = result.map((r: any) => r.item)
    }
  }
}
</script>
