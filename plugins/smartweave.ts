import { LoggerFactory, RedstoneGatewayInteractionsLoader, SmartWeave, SmartWeaveNodeFactory, SmartWeaveWebFactory } from 'redstone-smartweave'
import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'

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

export default ({ app }: Context, inject: Inject) => {
  try {
    if (process.server) {
      LoggerFactory.INST.logLevel('error')
    } else if (process.env.NODE_ENV === 'development') {
      LoggerFactory.INST.logLevel('error')
    }

    let smartweave = process.server
      ? SmartWeaveNodeFactory.memCachedBased(app.$arweave)
      : SmartWeaveWebFactory.memCachedBased(app.$arweave)

    // if (process.env.NODE_ENV !== 'development') {
    //   smartweave.setInteractionsLoader(
    //     new RedstoneGatewayInteractionsLoader(CONTRACT_GATEWAY)
    //   )
    // }

    inject('smartweave', smartweave.build())
  } catch (error) {
    console.error('Error during SmartWeave plugin bootstrap', error)
  }
}
