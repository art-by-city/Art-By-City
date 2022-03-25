import { ToastService } from './toasts'

export type ToastType = 'success' | 'info' | 'warning' | 'error'
export interface ToastMessage {
  timestamp: number
  type: ToastType
  message: string
  show: boolean
  timeout?: number
}

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $toasts: ToastService
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside
  // asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $toasts: ToastService
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $toasts: ToastService
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $toasts: ToastService
  }
}
