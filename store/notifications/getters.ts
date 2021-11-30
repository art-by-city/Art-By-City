import { getterTree } from 'typed-vuex'

import state from './state'

const getters = getterTree(state, {
  list: (state) => state.notifications,

  listUnread: (state) => state.notifications.filter((notif) => !notif.read)
})

export default getters
