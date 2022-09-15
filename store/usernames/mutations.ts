import Vue from 'vue'
import { mutationTree } from 'typed-vuex'

import { UsernamesContractState } from '~/app/services/username/contract'
import state from './state'

export const SET_USERNAMES = 'SET_USERNAMES'

const mutations = mutationTree(state, {
  [SET_USERNAMES](state, usernames: UsernamesContractState['usernames']) {
    state.usernames = usernames
  }
})

export default mutations
