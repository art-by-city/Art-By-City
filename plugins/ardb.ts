import Arweave from 'arweave'
import ArDB from '@textury/ardb'
import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $ardb: ArDB
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside
  // asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $ardb: ArDB
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $ardb: ArDB
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $ardb: ArDB
  }
}

export default ({ $config }: Context, inject: Inject) => {
  try {
    const arweave = new Arweave($config.arweave?.apiConfig || {})
    inject('ardb', new ArDB(arweave, 2))
  } catch (error) {
    console.error('Error during ArDB plugin bootstrap', error)
  }
}
