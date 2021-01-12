import { ActionTree } from 'vuex'

import ArtworkType from '~/models/artwork/artworkType'

const defaultState = {
  cities: [] as any[],
  hashtags: [] as string[],
  artworkTypes: [] as ArtworkType[],
  maxUserArtworks: 10 as number
}
export const state = () => ({...defaultState})
export type ConfigStoreState = ReturnType<typeof state>
export const DefaultConfigStoreState: ConfigStoreState = {...defaultState}

export const mutations = {
  setConfig(state: ConfigStoreState, newState: ConfigStoreState) {
    state.cities = newState.cities
    state.hashtags = newState.hashtags
    state.artworkTypes = newState.artworkTypes
    state.maxUserArtworks = newState.maxUserArtworks
  },

  setCities(state: ConfigStoreState, cities: any[]) {
    state.cities = cities
  },

  setHashtags(state: ConfigStoreState, hashtags: string[]) {
    state.hashtags = hashtags
  }
}

export const actions: ActionTree<ConfigStoreState, any> = {
  async setConfig({ commit }): Promise<void> {
    try {
      const config = await this.$axios.$get('/api/config')
      commit('setConfig', config)
    } catch (error) {
      console.error(error)
    }
  }
}