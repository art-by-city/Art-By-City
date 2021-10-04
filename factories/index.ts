export interface IFactory<T> {
  create(...args: any): T
}

export { default as TransactionFactory } from './transaction'

export * from './artwork'
export * from './error'
export * from './notification'
