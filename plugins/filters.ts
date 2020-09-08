import Vue from 'vue'

import HumanDateDiffFilter from '~/filters/humanDateDiff.filter'
import LocaleDateFilter from '~/filters/localeDate.filter'

Vue.filter('humanDateDiff', HumanDateDiffFilter)
Vue.filter('localeDate', LocaleDateFilter)
