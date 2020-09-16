import _ from 'lodash'

export const readFileAsBinaryStringAsync = (file: File): Promise<string> => {
  return new Promise((resolve, _reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(<string>reader.result)
    }
    reader.readAsBinaryString(file)
  })
}

export const debounce = (func: (...args: any) => any, timeout?: number) => {
  return _.debounce(func, timeout || 300, { leading: true, trailing: false })
}
