import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'
import Arweave from 'arweave'

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $arweave: Arweave
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside
  // asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $arweave: Arweave
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $arweave: Arweave
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $arweave: Arweave
  }
}

export default ({ $config }: Context, inject: Inject) => {
  try {
    inject('arweave', new Arweave($config.arweave?.apiConfig || {}))
  } catch (error) {
    console.error('Error during Arweave plugin bootstrap', error)
  }
}
