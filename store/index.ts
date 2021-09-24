import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { getAccessorType } from 'typed-vuex'

import transactionsState from './transactions/state'
import transactionsGetters from './transactions/getters'
import transactionsMutations from './transactions/mutations'
import transactionsActions from './transactions/actions'
import notificationsState from './notifications/state'
import notificationsGetters from './notifications/getters'
import notificationsMutations from './notifications/mutations'
import notificationsActions from './notifications/actions'

const defaultState = {}
export const state = () => ({...defaultState})
export type RootState = ReturnType<typeof state>
export const getters: GetterTree<RootState, RootState> = {}
export const mutations: MutationTree<RootState> = {}
export const actions: ActionTree<RootState, RootState> = {}

export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
  modules: {
    transactions: {
      state: transactionsState,
      getters: transactionsGetters,
      mutations: transactionsMutations,
      actions: transactionsActions
    },
    notifications: {
      state: notificationsState,
      getters: notificationsGetters,
      mutations: notificationsMutations,
      actions: notificationsActions
    }
  }
})

declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessorType
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessor: typeof accessorType
  }
}
