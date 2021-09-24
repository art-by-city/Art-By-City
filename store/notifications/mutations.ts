import { mutationTree } from 'typed-vuex'

import { Notification } from '~/models'
import state from './state'

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION'

const mutations = mutationTree(state, {
  [ADD_NOTIFICATION](state, payload: Notification) {
    state.notifications.unshift(payload)
  }
})

export default mutations
