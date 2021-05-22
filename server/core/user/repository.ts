import { injectable, inject } from 'inversify'
import { DocumentReference, Firestore, FieldValue } from '@google-cloud/firestore'

import DatabaseAdapter from '../db/adapter.interface'
import { User, UserRepository } from './'
import BaseRepositoryImpl from '../db/repository'

@injectable()
export default class UserRepositoryImpl
  extends BaseRepositoryImpl<User>
  implements UserRepository {
  private client: Firestore

  constructor(
    @inject(Symbol.for('DatabaseAdapter')) databaseAdapter: DatabaseAdapter
  ) {
    super(User)
    this.client = databaseAdapter.getClient()
  }

  getByUsername(username: string): Promise<User | null> {
    try {
      return this.repository
        .whereEqualTo('username', username)
        .findOne()
    } catch (error) {
      throw new Error(`Error getting user by username: ${error.message}`)
    }
  }

  getByEmail(email: string): Promise<User | null> {
    try {
      return this.repository
        .whereEqualTo('email', email)
        .findOne()
    } catch (error) {
      throw new Error(`Error getting user by email: ${error.message}`)
    }
  }

  find(): Promise<User[]> {
    try {
      return this.repository.find()
    } catch (error) {
      throw new Error(`Error listing users: ${error.message}`)
    }
  }

  getDocumentReference(id: string): DocumentReference<User> {
    return <DocumentReference<User>>this.client.doc(`Users/${id}`)
  }

  async incrementUserArtworkCount(userId: string): Promise<void> {
    const result = await this.getDocumentReference(userId).update({ artworkCount: FieldValue.increment(1) })
  }

  async decrementUserArtworkCount(userId: string): Promise<void> {
    const result = await this.getDocumentReference(userId).update({ artworkCount: FieldValue.increment(-1) })
  }
}
