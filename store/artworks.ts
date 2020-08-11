import { ActionTree, MutationTree } from 'vuex'

import ArtworkOptions from '../models/artwork/artworkOptions'

export const state = () => ({
  list: [] as any[],
  prev: [] as any[],
  isPrevBeingViewed: false as boolean,
  options: {
    city: '',
    type: '',
    hashtags: [] as string[]
  } as ArtworkOptions
})

export type ArtworkStoreState = ReturnType<typeof state>

export const mutations: MutationTree<ArtworkStoreState> = {
  set(state: ArtworkStoreState, artworks: any[]) {
    state.prev = [ ...state.list ]
    state.list = [ ...artworks ]
  },

  previous(state: ArtworkStoreState) {
    const temp = [ ...state.list ]
    state.list = [ ...state.prev ]
    state.prev = [ ...temp ]
    state.isPrevBeingViewed = !state.isPrevBeingViewed
  },

  options(state: ArtworkStoreState, options: any) {
    state.options = options
  }
}

export const actions: ActionTree<ArtworkStoreState, any> = {
  async fetchArtworks({ state, commit }): Promise<void> {
    const params = { ...state.options }

    if (params.type === 'All') {
      delete params.type
    }

    if (params.city === 'All') {
      delete params.city
    }

    try {
      const { payload } = await this.$axios.$get('/api/artwork', { params })

      commit('set', payload)
    } catch (error) {
      console.error(error)
    }
  }
}
