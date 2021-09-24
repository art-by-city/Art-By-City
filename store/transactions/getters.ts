import { getterTree } from 'typed-vuex'

import state from './state'

const getters = getterTree(state, {
  list: (state) => state.transactions,

  listProcessing: (state) => state.transactions.filter((tx) => [
    'PENDING_SUBMISSION',
    'PENDING_CONFIRMATION',
    'DROPPED',
    'CONFIRMING'
  ].includes(tx.status)),

  getById: (state) => (id: string) => state.transactions.find(
    (tx) => id === tx.transaction.id
  ) || null
})

export default getters
