import { actionTree } from 'typed-vuex'

import { TransactionNotificationType, UserTransactionType } from '~/types'
import { TransactionNotificationFactory } from '~/factories'
import state from './state'
import getters from './getters'
import mutations, { ADD_NOTIFICATION } from './mutations'

interface TransactionNotificationPayload {
  type: TransactionNotificationType
  txId: string
  txType: UserTransactionType
}

const actions = actionTree({ state, getters, mutations }, {
  addTransactionNotification(
    { commit },
    payload: TransactionNotificationPayload
  ) {
    commit(
      ADD_NOTIFICATION,
      new TransactionNotificationFactory().create(
        payload.txType,
        payload.txId,
        payload.type
      )
    )
  }
})

export default actions
