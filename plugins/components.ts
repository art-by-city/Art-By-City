import Vue from 'vue'

import {
  ArtistTag,
  DateWithTooltip,
  UserAvatar,
  ImageFileInput
} from '~/components/common'

Vue.use({
  install (vue) {
    vue.component('DateWithTooltip', DateWithTooltip)
    vue.component('UserAvatar', UserAvatar)
    vue.component('ArtistTag', ArtistTag)
    vue.component('ImageFileInput', ImageFileInput)
  }
})
