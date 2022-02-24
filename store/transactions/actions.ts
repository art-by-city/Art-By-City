import { actionTree } from 'typed-vuex'

import {
  SetUserTransactionStatusPayload,
  TransactionNotificationType,
  UserTransaction
} from '~/types'
import { accessorType } from '~/store'
import state from './state'
import getters from './getters'
import mutations, { ADD_TRANSACTION, REMOVE_TRANSACTION, SET_TRANSACTION_STATUS } from './mutations'

const actions = actionTree({ state, getters, mutations }, {
  queueTransaction({}, tx: UserTransaction) {
    const accessor = (<typeof accessorType>this.app.$accessor)

    accessor.transactions[ADD_TRANSACTION](tx)
  },
  updateStatus(
    { commit, state },
    payload: SetUserTransactionStatusPayload
  ) {
    const tx = state.transactions.find(
      (tx) => tx.id === payload.id
    )

    if (tx) {
      const prevStatus = '' + tx.status

      if (payload.status === 'CONFIRMED' || payload.status === 'DROPPED') {
        commit(REMOVE_TRANSACTION, { id: payload.id, result: payload.status })
      } else {
        commit(SET_TRANSACTION_STATUS, payload)
      }

      if (prevStatus !== payload.status) {
        const accessor = (<typeof accessorType>this.app.$accessor)
        let type!: TransactionNotificationType
        switch (payload.status) {
          case 'PENDING_CONFIRMATION':
            type = 'Submitted'
            break
          case 'CONFIRMING':
            type = 'Accepted'
            break
          case 'DROPPED':
            type = 'Dropped'
            break
          case 'CONFIRMED':
            type = 'Confirmed'
            break
          default:
            break
        }

        if (type) {
          accessor.notifications.addTransactionNotification({
            txType: tx.type, type, txId: tx.id
          })
        }
      }
    }
  }
})

export default actions
