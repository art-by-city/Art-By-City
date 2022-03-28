import _ from 'lodash'

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
