import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'
import localforage from 'localforage'

interface LocalForageWithUserStorage extends LocalForage {
  userStorage: LocalForage
}

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $localforage: LocalForageWithUserStorage
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside
  // asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $localforage: LocalForageWithUserStorage
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $localforage: LocalForageWithUserStorage
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $localforage: LocalForageWithUserStorage
  }
}

export default ({ $config }: Context, inject: Inject) => {
  try {
    const baseOpts = {
      driver: localforage.INDEXEDDB,
      name: $config.arweave.app.name
    }
    const publicOpts = { ...baseOpts, storeName: 'public' }
    const userOpts = { ...baseOpts, storeName: 'user' }

    const instance =
      localforage.createInstance(publicOpts) as LocalForageWithUserStorage

    instance.userStorage = localforage.createInstance(userOpts)

    inject('localforage', instance)
  } catch (error) {
    console.error('Error during LocalForage plugin bootstrap', error)
  }
}
