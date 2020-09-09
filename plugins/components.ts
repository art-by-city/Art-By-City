import Vue from 'vue'

import DateWithTooltipComponent from '~/components/common/dateWithTooltip.component.vue'

Vue.use({
  install (vue) {
    vue.component('DateWithTooltip', DateWithTooltipComponent)
  }
})
