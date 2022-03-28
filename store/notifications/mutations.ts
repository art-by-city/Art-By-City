import { mutationTree } from 'typed-vuex'

import { Notification } from '~/app/ui'
import { MarkNotificationsReadPayload } from '~/app/ui'
import state from './state'

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION'
export const MARK_NOTIFICATIONS_READ = 'MARK_NOTIFICATIONS_READ'

const mutations = mutationTree(state, {
  [ADD_NOTIFICATION](state, payload: Notification) {
    state.notifications.unshift(payload)
  },

  [MARK_NOTIFICATIONS_READ](state, payload: MarkNotificationsReadPayload) {
    state.notifications.forEach((notif) => {
        if (!notif.read) {
          notif.read = payload.readtime
        }
      })

    state.notifications = [ ...state.notifications ]
  }
})

export default mutations
