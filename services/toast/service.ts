type AlertType = 'success' | 'info' | 'warning' | 'error'

interface ToastMessage {
  type: AlertType
  message: string
  show: boolean
}

const TOAST_TIMEOUT_MS = 5000

class ToastService {
  toasts: ToastMessage[] = []

  alert(message: string, type: AlertType) {
    const toast = { message, type, show: true }
    this.toasts.push(toast)
    setTimeout(() => {
      toast.show = false
    }, TOAST_TIMEOUT_MS)
  }

  success(message: string) {
    this.alert(message, 'success')
  }

  info(message: string) {
    this.alert(message, 'info')
  }

  warning(message: string) {
    this.alert(message, 'warning')
  }

  error(message: string) {
    this.alert(message, 'error')
  }
}

export default new ToastService()
