export const readFileAsDataUrlAsync = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (evt) => {
      if (!evt.target || !evt.target.result) {
        reject('Error reading file')
      }

      resolve(reader.result as string)
    }
    reader.readAsDataURL(file)
  })
}

export function dataUrlToArrayBuffer(dataUrl: string) {
  return base64ToArrayBuffer(dataUrl.split(',')[1])
}

export function base64ToArrayBuffer(base64: string) {
  const binary_string = window.atob(base64)
  const len = binary_string.length
  const bytes = new Uint8Array(len)

  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i)
  }

  return bytes.buffer
}

export function isTouchDevice() {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     ((navigator as any).msMaxTouchPoints > 0))
}

export const arweaveTxRegex = /^\/?([a-z0-9-_]{43})/i

export function isDev() {
  return process.env.NODE_ENV !== 'production' &&
         process.env.NODE_ENV !== 'staging'
}
