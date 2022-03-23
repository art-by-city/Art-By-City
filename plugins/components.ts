import Vue from 'vue'

import {
  DateWithTooltip,
  UserAvatar,
  SplashLogo,
  TransactionPlaceholder,
  CurrencyEstimate
} from '~/components/common'

Vue.use({
  install (vue) {
    vue.component('DateWithTooltip', DateWithTooltip)
    vue.component('UserAvatar', UserAvatar)
    vue.component('SplashLogo', SplashLogo)
    vue.component('TransactionPlaceholder', TransactionPlaceholder)
    vue.component('CurrencyEstimate', CurrencyEstimate)
  }
})
