import { Firestore } from '@google-cloud/firestore'

export default interface DatabaseAdapter {
  initialize(): void
  getClient(): Firestore
}
