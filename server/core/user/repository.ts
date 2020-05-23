import { injectable, inject } from 'inversify'
import { getRepository } from 'fireorm'
import { DocumentReference, Firestore } from '@google-cloud/firestore'

import DatabaseAdapter from '../db/adapter.interface'
import { User, UserRepository } from './'

@injectable()
export default class UserRepositoryImpl implements UserRepository {
  private repository = getRepository(User)
  private client: Firestore

  constructor(
    @inject(Symbol.for('DatabaseAdapter')) databaseAdapter: DatabaseAdapter
  ) {
    this.client = databaseAdapter.getClient()
  }

  async create(user: User): Promise<User> {
    if (!(await this.getByUsername(user.username))) {
      return this.repository.create(user)
    }

    throw new Error('Error creating user: Username already taken')
  }

  get(id: string): Promise<User | null> {
    try {
      return this.repository.findById(id)
    } catch (error) {
      throw new Error(`Error getting user by id: ${error.message}`)
    }
  }

  update(user: User): Promise<User | null> {
    try {
      return this.repository.update(user)
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`)
    }
  }

  delete(id: string): Promise<void> {
    try {
      return this.repository.delete(id)
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`)
    }
  }

  getByUsername(username: string): Promise<User | null> {
    try {
      return this.repository.whereEqualTo('username', username).findOne()
    } catch (error) {
      throw new Error(`Error getting user by username: ${error.message}`)
    }
  }

  list(): Promise<User[]> {
    try {
      return this.repository.find()
    } catch (error) {
      throw new Error(`Error listing users: ${error.message}`)
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
    return <DocumentReference<User>>this.client.doc(`Artworks/${id}`)
  }
}
