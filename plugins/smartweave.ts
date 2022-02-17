import { LoggerFactory, SmartWeave, SmartWeaveNodeFactory, SmartWeaveWebFactory } from 'redstone-smartweave'
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

export default ({ app }: Context, inject: Inject) => {
  try {
    LoggerFactory.INST.logLevel('error')
    if (process.server) {
      inject('smartweave', SmartWeaveNodeFactory.memCached(app.$arweave))
    } else {
      inject('smartweave', SmartWeaveWebFactory.memCached(app.$arweave))
    }
  } catch (error) {
    console.error('Error during SmartWeave plugin bootstrap', error)
  }
}
