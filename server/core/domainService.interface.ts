export default interface DomainService<T> {
  create(thing: T): Promise<T | null>
  get(id: string): Promise<T | null>
  list(): Promise<T[]>
  update(thing: T): Promise<T | null>
  delete(id: string): Promise<void>
}
