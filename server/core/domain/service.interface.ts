import { DomainServiceResult } from './results'

export default interface DomainService<T> {
  create(thing: T): Promise<DomainServiceResult<T>>
  get(id: string): Promise<DomainServiceResult<T>>
  update(thing: T, modifyUpdated?: boolean): Promise<DomainServiceResult<T>>
  delete(id: string): Promise<void>
  list(): Promise<DomainServiceResult<T[]>>
}
