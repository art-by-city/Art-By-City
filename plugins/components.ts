import Vue from 'vue'

import {
  DateWithTooltip,
  UserAvatar,
  ImageFileInput,
  SplashLogo
} from '~/components/common'

Vue.use({
  install (vue) {
    vue.component('DateWithTooltip', DateWithTooltip)
    vue.component('UserAvatar', UserAvatar)
    vue.component('ImageFileInput', ImageFileInput)
    vue.component('SplashLogo', SplashLogo)
  }
})
