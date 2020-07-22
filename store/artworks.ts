import { ActionTree, MutationTree } from 'vuex'

import ArtworkOptions from '../models/artwork/artworkOptions'

export const state = () => ({
  slotA: [] as any[],
  slotB: [] as any[],
  visibleSlot: 'B',
  options: {
    city: '',
    type: '',
    hashtags: [] as string[]
  } as ArtworkOptions
})

export type ArtworkStoreState = ReturnType<typeof state>

export const mutations: MutationTree<ArtworkStoreState> = {
  set(state: ArtworkStoreState, artworks: any[]) {
    if (state.visibleSlot === 'A') {
      state.slotB = artworks
      state.visibleSlot = 'B'
    } else {
      state.slotA = artworks
      state.visibleSlot = 'A'
    }
  },

  previous(state: ArtworkStoreState) {
    if (state.visibleSlot === 'A' && state.slotB.length > 0) {
      state.visibleSlot = 'B'
    } else {
      state.visibleSlot = 'A'
    }
  },

  options(state: ArtworkStoreState, options: any) {
    state.options = options
  }
}

export const actions: ActionTree<ArtworkStoreState, any> = {
  async fetchArtworks({ state, commit }): Promise<void> {
    const params = { ...state.options }

    if (params.type === 'Any') {
      delete params.type
    }

    if (params.city === 'Any') {
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
