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

export function isTouchDevice() {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     ((navigator as any).msMaxTouchPoints > 0))
}

export const arweaveTxRegex = /^\/?([a-z0-9-_]{43})/i
