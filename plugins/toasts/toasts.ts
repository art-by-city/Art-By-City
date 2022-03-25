import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'
import { Store } from 'vuex'

import { ToastMessage, ToastType } from './'

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

const TOAST_TIMEOUT_MS = 5000

export class ToastService {
  $store!: Store<any>
  list: ToastMessage[] = []

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

    this.list.push(toast)
    this.removeOnExpiration(toast)
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

  error(error: string | AxiosError | Error) {
    if (typeof error === 'string') {
      return this.toast(error, 'error')
    }

    if (error instanceof Error) {
      return this.toast(error.message, 'error')
    }

    if (error.response) {
      const msg = error.response?.status === 413
        ? 'Image(s) too big'
        : error.response?.data?.error?.message || 'Unknown error'

      return this.toast(msg, 'error')
    }
  }

  remove(toast: ToastMessage) {
    const idx = this.list.findIndex((t) => {
      return t === toast
    })

    if (idx > -1) {
      this.list.splice(idx, 1)
    }
  }

  private async removeOnExpiration(toast: ToastMessage): Promise<void> {
    if (toast.timeout) {
      setTimeout(() => {
        this.remove(toast)
      }, toast.timeout)
    }
  }
}

export default (context: Context, inject: Inject) => {
  inject('toasts', new ToastService(context))
}
