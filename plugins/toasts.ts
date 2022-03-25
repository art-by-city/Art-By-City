import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'
import { Store } from 'vuex'

export type ToastType = 'success' | 'info' | 'warning' | 'error'
export interface ToastMessage {
  timestamp: number
  type: ToastType
  message: string
  show: boolean
  timeout?: number
}

interface AxiosError {
  response: {
    status: number
    data: {
      error: {
        message: string
      }
    }
  }
}

function isAxiosError(thing: any): thing is AxiosError {
  return (thing as AxiosError).response !== undefined
}

const TOAST_TIMEOUT_MS = 5000

export class ToastService {
  $store!: Store<any>

  constructor({ store }: Context) {
    this.$store = store
  }

  toast(message: string, type: ToastType) {
    const toast: ToastMessage = {
      message,
      type,
      show: true,
      timestamp: Date.now()
    }

    if (type !== 'error') {
      toast.timeout = TOAST_TIMEOUT_MS
    }

    this.$store.commit('toasts/add', toast)
    this.$store.dispatch('toasts/destroyOnExpiration', toast)
  }

  success(message: string) {
    this.toast(message, 'success')
  }

  info(message: string) {
    this.toast(message, 'info')
  }

  warning(message: string) {
    this.toast(message, 'warning')
  }

  error(error: string | AxiosError) {
    if (isAxiosError(error)) {
      const msg = error.response?.status === 413
        ? 'Image(s) too big'
        : error.response?.data?.error?.message || 'Unknown error'

      return this.toast(msg, 'error')
    }

    return this.toast(error, 'error')
  }
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

export default (context: Context, inject: Inject) => {
  inject('toasts', new ToastService(context))
}
