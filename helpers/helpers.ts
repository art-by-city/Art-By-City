export const readFileAsDataUrlAsync = (file: File): Promise<string> => {
  return new Promise((resolve, _reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(<string>reader.result)
    }
    reader.readAsDataURL(file)
  })
}

export function isTouchDevice() {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0));
}
