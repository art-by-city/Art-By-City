import { DocumentReference } from '@google-cloud/firestore'

export default interface Repository<T> {
  create(thing: T): Promise<T>
  get(id: string): Promise<T | null>
  list(): Promise<T[]>
  update(thing: T): Promise<T>
  delete(id: string): Promise<void>
  getDocumentReference(id: string): DocumentReference<T>
  find(thing?: T): Promise<T[]>
}
