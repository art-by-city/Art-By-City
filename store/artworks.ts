export const state = () => ({
  list: [] as any[]
})

export type ArtworkStoreState = ReturnType<typeof state>

export const mutations = {
  set(state: ArtworkStoreState, artworks: any[]) {
    state.list = artworks
  }
}
