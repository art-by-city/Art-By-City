import { GetterTree, MutationTree } from 'vuex'
import { actionTree, getAccessorType } from 'typed-vuex'
import { Context } from '@nuxt/types'

import {
  CLEAR_MUTATION,
  RESTORE_MUTATION
} from '~/plugins/persist-store'
import {
  SsrContextWithWarpContractMemcache
} from '~/modules/warp-contract-memcache'
import transactionsState from './transactions/state'
import transactionsGetters from './transactions/getters'
import transactionsMutations from './transactions/mutations'
import transactionsActions from './transactions/actions'
import notificationsState from './notifications/state'
import notificationsGetters from './notifications/getters'
import notificationsMutations from './notifications/mutations'
import notificationsActions from './notifications/actions'
import {
  SET_USERNAMES,
  usernamesActions,
  usernamesState,
  usernamesMutations,
} from './usernames'

const defaultState = {}
export const state = () => ({...defaultState})
export type RootState = ReturnType<typeof state>
export const getters: GetterTree<RootState, RootState> = {}
export const mutations: MutationTree<RootState> = {
  CLEAR_MUTATION,
  RESTORE_MUTATION
}
export const actions = actionTree({ state }, {
  async nuxtServerInit({ commit }, context: Context) {
    const smartweaveCache = (
      context.ssrContext as SsrContextWithWarpContractMemcache
    ).$smartweaveCache

    const { usernames } = await smartweaveCache.readState('usernames')
    commit(`usernames/${SET_USERNAMES}`, usernames)
  }
})

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
    },
    usernames: {
      state: usernamesState,
      mutations: usernamesMutations,
      actions: usernamesActions
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
