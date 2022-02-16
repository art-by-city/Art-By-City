import { ActionTree, MutationTree } from 'vuex'

import ToastMessage from '~/models/toasts/toastMessage'

export const state = () => ({
  list: [] as ToastMessage[]
})

export type ToastStoreState = ReturnType<typeof state>

export const mutations: MutationTree<ToastStoreState> ={
  add(state: ToastStoreState, toast: ToastMessage) {
    state.list.push(toast)
  },

  remove(state: ToastStoreState, toast: ToastMessage) {
    const idx = state.list.findIndex((t) => {
      return t === toast
    })
    if (idx > -1) {
      state.list.splice(idx, 1)
    }
  }
}

export const actions: ActionTree<ToastStoreState, any> = {
  async destroyOnExpiration({ commit }, toast: ToastMessage): Promise<void> {
    if (toast.timeout) {
      setTimeout(() => {
        commit('remove', toast)
      }, toast.timeout)
    }
  }
}
