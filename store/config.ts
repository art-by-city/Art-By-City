export const state = () => ({
  cities: [] as string[]
})

export type ConfigStoreState = ReturnType<typeof state>

export const mutations = {
  setCities(state: ConfigStoreState, cities: string[]) {
    state.cities = cities
  }
}
