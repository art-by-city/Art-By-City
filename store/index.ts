import { ActionTree } from 'vuex'

const defaultState = {}
export const state = () => ({...defaultState})
export type IndexStoreState = ReturnType<typeof state>
export const actions: ActionTree<IndexStoreState, any> = {
  async nuxtServerInit({ dispatch }): Promise<void> {
    await dispatch('config/setConfig')
  }
}
