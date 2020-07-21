export const state = () => ({
  cities: [] as any[],
  hashtags: [] as string[]
})

export type ConfigStoreState = ReturnType<typeof state>

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
