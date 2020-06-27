export const state = () => ({
  list: [] as any[],
  prev: [] as any[]
})

export type ArtworkStoreState = ReturnType<typeof state>

export const mutations = {
  set(state: ArtworkStoreState, artworks: any[]) {
    state.prev = state.list
    state.list = artworks
  },

  previous(state: ArtworkStoreState) {
    console.log('artworkstore previous() prev', state.prev.length, state.prev)
    if (state.prev.length > 0) {
      state.list = state.prev
      state.prev = []
    }
    console.log('artworkstore previous() list', state.list.length, state.list)
  }
}
