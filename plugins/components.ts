import Vue from 'vue'

import DateWithTooltipComponent from '~/components/common/DateWithTooltip.component.vue'
import UserAvatarComponent from '~/components/common/UserAvatar.component.vue'

Vue.use({
  install (vue) {
    vue.component('DateWithTooltip', DateWithTooltipComponent)
    vue.component('UserAvatar', UserAvatarComponent)
  }
})
