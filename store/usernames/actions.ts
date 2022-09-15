import { actionTree } from 'typed-vuex'

import state from './state'
import mutations, { SET_USERNAMES } from './mutations'

export const FETCH_USERNAMES = 'FETCH_USERNAMES'

const actions = actionTree({ state, mutations }, {
  async [FETCH_USERNAMES]({ commit }) {
    const usernames = await this.app.$axios.$get('/node/usernames')
    commit(SET_USERNAMES, usernames)
  }
})

export default actions
