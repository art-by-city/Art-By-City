import {
  LoggerFactory,
  Warp,
  WarpNodeFactory,
  WarpWebFactory
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
    if (process.env.NODE_ENV !== 'development') {
      LoggerFactory.INST.logLevel('fatal')
    } else {
      LoggerFactory.INST.logLevel('error')
    }

    let warp = process.server
      ? WarpNodeFactory.memCachedBased(app.$arweave as any)
      : WarpWebFactory.memCachedBased(app.$arweave as any)

    if (process.env.NODE_ENV !== 'production') {
      warp.useArweaveGateway()
    }

    inject('warp', warp.build())
  } catch (error) {
    console.error('Error during Warp contracts plugin bootstrap', error)
  }
}
