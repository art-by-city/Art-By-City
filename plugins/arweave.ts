import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'
import Arweave from 'arweave'
import { AxiosInstance } from 'axios'

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
    const arweave = new Arweave($config.arweave?.api || {})

    // NB: Add 'origin' header on SSR request to play nice with
    //     art-by-city/arlocal-reverse-proxy CORS feature
    //     Can take this out if reverse proxy project is deprecated
    if (process.server) {
      const _request = arweave.api.request.bind(arweave.api)

      arweave.api.request = () => {
        const instance = _request()

        instance.interceptors.request.use((config) => {
          if (config.headers) {
            config.headers.origin = $config.baseUrl
          }

          return config
        })

        return instance
      }
    }

    inject('arweave', arweave)
  } catch (error) {
    console.error('Error during Arweave plugin bootstrap', error)
  }
}
