export interface DomainServiceOptions {
  hydrated?: boolean
}

export default interface DomainService<T> {
  create(thing: T): Promise<T | null>
  get(id: string): Promise<T | null>
  update(thing: T): Promise<T | null>
  delete(id: string): Promise<void>
  list(): Promise<T[]>
}
