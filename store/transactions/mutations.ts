import Vue from 'vue'
import { mutationTree } from 'typed-vuex'

import { SetUserTransactionStatusPayload, UserTransaction } from '~/types'
import state from './state'

export const ADD_TRANSACTION = 'ADD_TRANSACTION'
export const REMOVE_TRANSACTION = 'REMOVE_TRANSACTION'
export const SET_TRANSACTION_STATUS = 'SET_TRANSACTION_STATUS'

type RemoveTransactionPayload = {
  id: string
  result: 'CONFIRMED' | 'DROPPED'
}

const mutations = mutationTree(state, {
  [ADD_TRANSACTION](state, payload: UserTransaction) {
    state.transactions.unshift(payload)
  },

  [REMOVE_TRANSACTION](state, payload: RemoveTransactionPayload) {
    const idx = state.transactions.findIndex(tx => tx.id === payload.id)

    if (idx >= 0) {
      state.transactions.splice(idx, 1)
    }
  },

  [SET_TRANSACTION_STATUS](state, payload: SetUserTransactionStatusPayload) {
    const idx = state.transactions.findIndex(tx => tx.id === payload.id)

    if (idx >= 0) {
      Vue.set(state.transactions[idx], 'status', payload.status)
      Vue.set(state.transactions[idx], 'confirmations', payload.confirmations)
      if (payload.lastSubmission) {
        Vue.set(
          state.transactions[idx],
          'lastSubmission',
          payload.lastSubmission
        )
      }
    }
  }
})

export default mutations
