import { getterTree } from 'typed-vuex'

import state from './state'

const getters = getterTree(state, {
  list(state) {
    return state.notifications
  }
})

export default getters
