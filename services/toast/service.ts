import { Context } from '@nuxt/types'

import ToastType from '../../models/toasts/toastType'

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

export default class ToastService {
  _context!: Context

  constructor(context: Context) {
    this._context = context
  }

  toast(message: string, type: ToastType) {
    const toast = {
      message,
      type,
      show: true,
      timeout: TOAST_TIMEOUT_MS,
      timestamp: Date.now()
    }
    this._context.store.commit('toasts/add', toast)
    this._context.store.dispatch('toasts/destroyOnExpiration', toast)
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
