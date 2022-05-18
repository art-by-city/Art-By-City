import {
  LoggerFactory,
  SmartWeave,
  SmartWeaveNodeFactory,
  SmartWeaveWebFactory
} from 'redstone-smartweave'
import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'
import Arweave from 'arweave'

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $smartweave: SmartWeave
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside
  // asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $smartweave: SmartWeave
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $smartweave: SmartWeave
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $smartweave: SmartWeave
  }
}

// const CONTRACT_GATEWAY = 'https://gateway.redstone.finance'

export default ({ $config }: Context, inject: Inject) => {
  try {
    if (process.env.NODE_ENV !== 'development') {
      LoggerFactory.INST.logLevel('fatal')
    } else {
      LoggerFactory.INST.logLevel('error')
    }

    const arweave = new Arweave($config.arweave?.api || {})

    let smartweave = process.server
      ? SmartWeaveNodeFactory.memCachedBased(arweave)
      : SmartWeaveWebFactory.memCachedBased(arweave)

    if (process.env.NODE_ENV !== 'development') {
      smartweave.useRedStoneGateway({ notCorrupted: true })
    } else {
      smartweave.useArweaveGateway()
    }

    inject('smartweave', smartweave.build())
  } catch (error) {
    console.error('Error during SmartWeave plugin bootstrap', error)
  }
}
