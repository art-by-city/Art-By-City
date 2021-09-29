import { mutationTree } from 'typed-vuex'

import { SetUserTransactionStatusPayload, UserTransaction } from '~/types'
import state from './state'

export const ADD_TRANSACTION = 'ADD_TRANSACTION'
export const SET_TRANSACTION_STATUS = 'SET_TRANSACTION_STATUS'

const mutations = mutationTree(state, {
  [ADD_TRANSACTION](state, payload: UserTransaction) {
    state.transactions.unshift(payload)
  },

  [SET_TRANSACTION_STATUS](state, payload: SetUserTransactionStatusPayload) {
    const idx = state.transactions.findIndex(
      (tx) => tx.transaction.id === payload.id
    )

    if (idx >=0) {
      state.transactions[idx].status = payload.status
      state.transactions[idx].confirmations = payload.confirmations

      state.transactions[idx] = { ...state.transactions[idx] }
      state.transactions = [ ...state.transactions ]
    }
  }
})

export default mutations
