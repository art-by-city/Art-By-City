import { Context } from '@nuxt/types'
import { queue } from 'async'

import { isDev } from '~/helpers'

import { DEFAULT_STATE as DEFAULT_TRANSACTIONS_STATE }
  from '~/store/transactions/state'
import { DEFAULT_STATE as DEFAULT_NOTIFICATIONS_STATE }
  from '~/store/notifications/state'

declare module 'vuex/types/index' {
  interface Store<S> {
    restored: Promise<boolean>
  }
}

const persistedUserModules = [
  { name: 'notifications', defaultState: DEFAULT_NOTIFICATIONS_STATE },
  { name: 'transactions',  defaultState: DEFAULT_TRANSACTIONS_STATE  },
]

const reducedDefaults: any = {}
persistedUserModules.forEach(({ name, defaultState }) => {
  reducedDefaults[name] = { ...defaultState }
})

export const RESTORE_MUTATION = (state: any, payload: any) => {
  persistedUserModules.forEach(({ name }) => {
    if (payload[name]) {
      state[name] = payload[name]
    }
  })
}

export const CLEAR_MUTATION = (state: any) => {
  persistedUserModules.forEach(({ name, defaultState }) => {
    state[name] = { ...defaultState }
  })
}

export default ({ store, $auth, $localforage }: Context) => {
  const q = queue(async (state: any, done) => {
    const reduced: any = {}
    persistedUserModules.forEach(({ name }) => { reduced[name] = state[name] })

    await $localforage.userStorage.setItem($auth.$state.user.address, reduced)

    done()
  })

  const restore = async () => {
    const savedState = Object.assign({}, await $localforage.userStorage.getItem(
      $auth.user.address
    ))

    if (isDev()) {
      // NB: store is in strict-mode for development
      store.commit('RESTORE_MUTATION', savedState)
    } else {
      store.replaceState(Object.assign(store.state, savedState))
    }
  }

  store.restored = new Promise(async (resolve) => {
    if ($auth.loggedIn) {
      await restore()
    }

    store.subscribe(async (mutation, state) => {
      if (
        $auth.loggedIn &&
        persistedUserModules.some(({ name }) => mutation.type.startsWith(name))
      ) {
        q.push(state)
      }

      if (mutation.type === 'auth/SET' && mutation.payload.key === 'loggedIn') {
        if (mutation.payload.value) {
          await restore()
        } else {
          store.commit('CLEAR_MUTATION')
        }
      }
    })

    resolve(true)
  })
}
