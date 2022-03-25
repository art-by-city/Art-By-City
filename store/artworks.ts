import { ActionTree, MutationTree } from 'vuex'

import { ArtworkOptions } from '~/types'

const maxArtworkHistory = 5

export const state = () => ({
  list: [] as any[],
  currentArtworkIndex: 0 as number,
  options: {
    city: '',
    type: '',
    hashtags: [] as string[]
  } as ArtworkOptions
})

export type ArtworkStoreState = ReturnType<typeof state>

export const mutations: MutationTree<ArtworkStoreState> = {
  add(state: ArtworkStoreState, artworks: any[]) {
    state.list.push(...artworks)
  },

  set(state: ArtworkStoreState, artworks: any[]) {
    state.list = [...artworks]
    state.currentArtworkIndex = 0
  },

  next(state: ArtworkStoreState, skip: number = 0) {
    const nextIndex = state.currentArtworkIndex + (1 + skip)
    if (nextIndex >= maxArtworkHistory) {
      // this is what we want to do, but it doesn't animate
      // state.list.shift()

      // for now do this and don't enforce max history
      state.currentArtworkIndex = nextIndex
    } else {
      state.currentArtworkIndex = nextIndex
    }
  },

  previous(state: ArtworkStoreState, skip: number = 0) {
    state.currentArtworkIndex = state.currentArtworkIndex - (1 + skip)
  },

  setOptions(state: ArtworkStoreState, options: any) {
    state.options = options
  }
}

export const actions: ActionTree<ArtworkStoreState, any> = {
  async fetch({ state, commit }): Promise<void> {
    const params = { ...state.options }

    try {
      const { payload } = await this.$axios.$get('/api/artwork', { params })
      commit('set', payload)
    } catch (error) {
      console.error(error)
    }
  },

  async fetchMore({ state, commit }): Promise<void> {
    const params = { ...state.options }

    try {
      const { payload } = await this.$axios.$get('/api/artwork', { params })

      commit('add', payload)
    } catch (error) {
      console.error(error)
    }
  }
}
