import memoizee from 'memoizee'

type AnyFunction = ((...args: any) => any)

const memoize = (opts: memoizee.Options<AnyFunction>) => (
  _target: Object,
  _propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<AnyFunction>
) => {
  if (descriptor.value) {
    descriptor.value = memoizee(descriptor.value, opts)
  }

  return descriptor
}

export default memoize