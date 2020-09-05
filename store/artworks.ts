import { ActionTree, MutationTree } from 'vuex'

import ArtworkOptions from '../models/artwork/artworkOptions'
import ProgressService from '~/services/progress/service'

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

  next(state: ArtworkStoreState) {
    const nextIndex = state.currentArtworkIndex + 1
    if (nextIndex >= maxArtworkHistory) {
      // this is what we want to do, but it doesn't animate
      // state.list.shift()

      // for now do this and don't enforce max history
      state.currentArtworkIndex = nextIndex
    } else {
      state.currentArtworkIndex = nextIndex
    }
  },

  previous(state: ArtworkStoreState) {
    state.currentArtworkIndex = state.currentArtworkIndex - 1
  },

  options(state: ArtworkStoreState, options: any) {
    state.options = options
  }
}

export const actions: ActionTree<ArtworkStoreState, any> = {
  async fetch({ state, commit }): Promise<void> {
    ProgressService.start()

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

    ProgressService.stop()
  },

  async fetchMore({ state, commit }): Promise<void> {
    ProgressService.start()

    const params = { ...state.options }

    if (params.type === 'All') {
      delete params.type
    }

    if (params.city === 'All') {
      delete params.city
    }

    try {
      const { payload } = await this.$axios.$get('/api/artwork', { params })

      commit('add', payload)
    } catch (error) {
      console.error(error)
    }

    ProgressService.stop()
  }
}
