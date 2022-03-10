import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'

import { Auth } from '~/app/auth'

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $auth: Auth
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside
  // asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $auth: Auth
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $auth: Auth
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $auth: Auth
  }
}

export default (ctx: Context, inject: Inject) => {
  try {
    inject('auth', new Auth(ctx))
  } catch (error) {
    console.error('Error during Auth plugin bootstrap', error)
  }
}

