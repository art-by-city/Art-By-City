import {
  defaultCacheOptions,
  LoggerFactory,
  Warp,
  WarpFactory
} from 'warp-contracts'
import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'

declare module 'vue/types/vue' {
  interface Vue {
    $warp: Warp
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $warp: Warp
  }
  interface Context {
    $warp: Warp
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $warp: Warp
  }
}

export default ({ app }: Context, inject: Inject) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      LoggerFactory.INST.logLevel('error')
    } else {
      LoggerFactory.INST.logLevel('fatal')
    }

    const warp = process.env.NODE_ENV !== 'production'
      ? WarpFactory.forLocal()
      : WarpFactory.forMainnet({
        ...defaultCacheOptions,
        inMemory: process.server
      })

    inject('warp', warp)
  } catch (error) {
    console.error('Error during Warp contracts plugin bootstrap', error)
  }
}
