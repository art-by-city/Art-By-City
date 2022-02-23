import { getterTree } from 'typed-vuex'

import { isProcessing } from '~/types'
import state from './state'

const getters = getterTree(state, {
  list: (state) => state.transactions,

  listProcessing: (state) => state.transactions.filter(
    (tx) => isProcessing(tx.status)
  ),

  getById: (state) => (id: string) => state.transactions.find(
    (tx) => id === tx.id
  ) || null
})

export default getters
