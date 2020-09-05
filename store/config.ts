import ArtworkType from '~/models/artwork/artworkType'

const defaultState = {
  cities: [] as any[],
  hashtags: [] as string[],
  artworkTypes: [] as ArtworkType[]
}
export const state = () => ({...defaultState})
export type ConfigStoreState = ReturnType<typeof state>
export const DefaultConfigStoreState: ConfigStoreState = {...defaultState}

export const mutations = {
  setConfig(state: ConfigStoreState, newState: ConfigStoreState) {
    state.cities = newState.cities
    state.hashtags = newState.hashtags
  },

  setCities(state: ConfigStoreState, cities: any[]) {
    state.cities = cities
  },

  setHashtags(state: ConfigStoreState, hashtags: string[]) {
    state.hashtags = hashtags
  }
}
