import _ from 'lodash'

export const readFileAsDataUrlAsync = (file: File): Promise<string> => {
  return new Promise((resolve, _reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(<string>reader.result)
    }
    reader.readAsDataURL(file)
  })
}

export type AnyFunction = ((...args: any) => any)

const _debounce = (
  _target: Object,
  _propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<AnyFunction>
) => {
  const timeout = 300
  if (descriptor.value) {
    descriptor.value = _.debounce(
      descriptor.value,
      timeout,
      { leading: true, trailing: false }
    )
  }

  return descriptor
}

export const debounce: MethodDecorator = <AnyFunction>_debounce

export function isTouchDevice() {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0));
}

export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
