import { DocumentReference } from '@google-cloud/firestore'

export default interface Repository<T, X> {
  save(thing: T): Promise<T>
  get(id: string): Promise<T | null>
  list(): Promise<T[]>
  delete(id: string): Promise<void>
  getDocumentReference(id: string): DocumentReference<T>
  find(filter?: X): Promise<T[]>
  findOne(filter?: X): Promise<T | null>
}
