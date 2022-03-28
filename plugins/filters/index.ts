import Vue from 'vue'

import HumanDateDiffFilter from './humanDateDiff.filter'
import LocaleDateFilter from './localeDate.filter'

Vue.filter('humanDateDiff', HumanDateDiffFilter)
Vue.filter('localeDate', LocaleDateFilter)
