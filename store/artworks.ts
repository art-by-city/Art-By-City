export const state = () => ({
  list: [] as any[],
  prev: [] as any[],
  options: {}
})

export type ArtworkStoreState = ReturnType<typeof state>

export const mutations = {
  set(state: ArtworkStoreState, artworks: any[]) {
    state.prev = state.list
    state.list = artworks
  },

  previous(state: ArtworkStoreState) {
    if (state.prev.length > 0) {
      state.list = state.prev
      state.prev = []
    }
  },

  options(state: ArtworkStoreState, options: any) {
    state.options = options
  }
}
