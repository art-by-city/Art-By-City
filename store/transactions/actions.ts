import { actionTree } from 'typed-vuex'

import {
  CreateUserTransactionPayload,
  SetUserTransactionStatusPayload,
  TransactionNotificationType,
  UserTransaction
} from '~/types'
import { accessorType } from '~/store'
import state from './state'
import getters from './getters'
import mutations, { ADD_TRANSACTION, SET_TRANSACTION_STATUS } from './mutations'

const actions = actionTree({ state, getters, mutations }, {
  queueTransaction({}, tx: UserTransaction) {
    // const tx: UserTransaction = {
    //   ...payload,
    //   status: 'PENDING_CONFIRMATION',
    //   created: new Date().getTime()
    // }
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

      commit(SET_TRANSACTION_STATUS, payload)

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
