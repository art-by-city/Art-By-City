import { ActionTree } from 'vuex'

import { ArtworkType } from '~/types'

const defaultState = {
  cities: [] as any[],
  hashtags: [] as string[],
  artworkTypes: [] as ArtworkType[],
  maxUserArtworks: 10 as number,
  changelogLatestVersion: ''
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
    if (newState.changelogLatestVersion) {
      state.changelogLatestVersion = newState.changelogLatestVersion
    }
  },

  setCities(state: ConfigStoreState, cities: any[]) {
    state.cities = cities
  },

  setHashtags(state: ConfigStoreState, hashtags: string[]) {
    state.hashtags = hashtags
  }
}

export const actions: ActionTree<ConfigStoreState, any> = {
  async setConfig2({ commit }): Promise<void> {
    try {
      const config = await this.$axios.$get('/api/config')
      commit('setConfig', config)
    } catch (error) {
      console.error(error)
    }
  }
}