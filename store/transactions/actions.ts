import { actionTree } from 'typed-vuex'

import {
  CreateUserTransactionPayload,
  SetUserTransactionStatusPayload,
  UserTransaction
} from '~/types'
import { accessorType } from '~/store'
import state from './state'
import getters from './getters'
import mutations, { ADD_TRANSACTION, SET_TRANSACTION_STATUS } from './mutations'

const actions = actionTree({ state, getters, mutations }, {
  queueTransaction({}, payload: CreateUserTransactionPayload) {
    const tx: UserTransaction = { ...payload, status: 'PENDING_SUBMISSION' }
    const accessor = (<typeof accessorType>this.app.$accessor)

    this.app.$txQueueService.push(tx)
    accessor.transactions[ADD_TRANSACTION](tx)
  },
  updateStatus(
    { commit, state },
    payload: SetUserTransactionStatusPayload
  ) {
    const tx = state.transactions.find(
      (tx) => tx.transaction.id === payload.id
    )

    if (tx) {
      const prevStatus = '' + tx.status

      commit(SET_TRANSACTION_STATUS, payload)

      if (prevStatus !== payload.status) {
        const accessor = (<typeof accessorType>this.app.$accessor)
        switch (payload.status) {
          case 'PENDING_CONFIRMATION':
            accessor.notifications.addTransactionNotification({
              txType: tx.type, type: 'Submitted', txId: tx.transaction.id
            })
            break
          case 'CONFIRMING':
            accessor.notifications.addTransactionNotification({
              txType: tx.type, type: 'Accepted', txId: tx.transaction.id
            })
            break
          case 'DROPPED':
            accessor.notifications.addTransactionNotification({
              txType: tx.type, type: 'Dropped', txId: tx.transaction.id
            })
            break
          case 'CONFIRMED':
            accessor.notifications.addTransactionNotification({
              txType: tx.type, type: 'Confirmed', txId: tx.transaction.id
            })
            break
          default:
            break
        }
      }
    }
  }
})

export default actions
